
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StudentResponse {
  currentProgram: string;
  favoriteSubjects: string;
  difficultSubjects: string;
  strengths: string;
  taskPreference: string;
  careerInterests: string;
}

interface Course {
  id: string;
  title: string;
  university: string;
  field: string;
  description: string;
  key_subjects: string[];
  career_prospects: string[];
  entry_requirements: string;
  duration: string;
  location: string;
  average_salary: string;
  employment_rate: string;
  embedding: number[];
}

// Helper function to make OpenAI API calls with retry logic
async function makeOpenAIRequest(url: string, body: any, apiKey: string, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      }

      // Handle rate limit errors specifically
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Rate limit hit on attempt ${attempt}. Waiting ${waitTime}ms before retry...`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }

      // For other errors, throw immediately
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying other errors too
      const waitTime = Math.pow(2, attempt) * 500; // Shorter wait for other errors
      console.log(`Request failed on attempt ${attempt}. Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const { studentResponses }: { studentResponses: StudentResponse } = await req.json();
    
    console.log('Processing student responses:', studentResponses);

    // Step 1: Concatenate student responses into descriptive text
    const descriptiveText = `
      Current Program: ${studentResponses.currentProgram}
      Favorite Subjects: ${studentResponses.favoriteSubjects}
      Difficult Subjects: ${studentResponses.difficultSubjects}
      Strengths: ${studentResponses.strengths}
      Task Preference: ${studentResponses.taskPreference}
      Career Interests: ${studentResponses.careerInterests}
    `.trim();

    console.log('Generated descriptive text:', descriptiveText);

    // Step 2: Generate embedding for student response with retry logic
    console.log('Generating student embedding...');
    const embeddingData = await makeOpenAIRequest(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-large',
        input: descriptiveText,
        dimensions: 3072
      },
      openaiApiKey
    );

    const studentEmbedding = embeddingData.data[0].embedding;
    console.log('Generated student embedding, length:', studentEmbedding.length);

    // Step 3: Store student response in database
    const { data: savedResponse, error: saveError } = await supabase
      .from('student_responses')
      .insert({
        current_program: studentResponses.currentProgram,
        favorite_subjects: studentResponses.favoriteSubjects,
        difficult_subjects: studentResponses.difficultSubjects,
        strengths: studentResponses.strengths,
        task_preference: studentResponses.taskPreference,
        career_interests: studentResponses.careerInterests,
        embedding: studentEmbedding
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving student response:', saveError);
      throw saveError;
    }

    console.log('Saved student response with ID:', savedResponse.id);

    // Step 4: Get all courses that HAVE embeddings (skip those without)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .not('embedding', 'is', null);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      throw coursesError;
    }

    console.log(`Found ${courses.length} courses with embeddings`);

    if (courses.length === 0) {
      // No courses have embeddings yet - suggest running the embedding generation
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No courses have embeddings generated yet. Please run the course embedding generation first.' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 5: Calculate cosine similarity between student and each course
    function cosineSimilarity(vecA: number[], vecB: number[]): number {
      const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    }

    const recommendations = courses.map(course => ({
      course,
      similarity: cosineSimilarity(studentEmbedding, course.embedding)
    }));

    // Step 6: Sort by similarity and get top 5
    const topRecommendations = recommendations
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    console.log('Top recommendations:', topRecommendations.map(r => ({
      title: r.course.title,
      similarity: r.similarity
    })));

    // Step 7: Save recommendations to database
    const recommendationInserts = topRecommendations.map(rec => ({
      student_response_id: savedResponse.id,
      course_id: rec.course.id,
      similarity_score: rec.similarity
    }));

    const { error: recError } = await supabase
      .from('recommendations')
      .insert(recommendationInserts);

    if (recError) {
      console.error('Error saving recommendations:', recError);
    }

    // Step 8: Format and return recommendations
    const formattedRecommendations = topRecommendations.map(rec => ({
      id: rec.course.id,
      title: rec.course.title,
      university: rec.course.university,
      field: rec.course.field,
      matchPercentage: Math.round(rec.similarity * 100),
      duration: rec.course.duration,
      location: rec.course.location,
      description: rec.course.description,
      keySubjects: rec.course.key_subjects,
      careerProspects: rec.course.career_prospects,
      entryRequirements: rec.course.entry_requirements,
      averageSalary: rec.course.average_salary,
      employmentRate: rec.course.employment_rate,
      similarityScore: rec.similarity
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations: formattedRecommendations,
        studentResponseId: savedResponse.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-course-recommendations:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

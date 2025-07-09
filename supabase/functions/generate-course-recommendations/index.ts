
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

    const { studentResponses }: { studentResponses: StudentResponse } = await req.json();
    
    console.log('Processing student responses:', studentResponses);

    // Step 1: Store student response in database
    const { data: savedResponse, error: saveError } = await supabase
      .from('student_responses')
      .insert({
        current_program: studentResponses.currentProgram,
        favorite_subjects: studentResponses.favoriteSubjects,
        difficult_subjects: studentResponses.difficultSubjects,
        strengths: studentResponses.strengths,
        task_preference: studentResponses.taskPreference,
        career_interests: studentResponses.careerInterests,
        embedding: null // We'll use text-based matching instead
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving student response:', saveError);
      throw saveError;
    }

    console.log('Saved student response with ID:', savedResponse.id);

    // Step 2: Use the database function for smart matching
    const { data: recommendations, error: recError } = await supabase
      .rpc('get_course_recommendations', {
        p_student_program: studentResponses.currentProgram,
        p_favorite_subjects: studentResponses.favoriteSubjects,
        p_career_interests: studentResponses.careerInterests,
        p_strengths: studentResponses.strengths
      });

    if (recError) {
      console.error('Error getting recommendations:', recError);
      throw recError;
    }

    console.log('Generated recommendations:', recommendations);

    // Step 3: Get full course details for the recommendations
    const courseIds = recommendations.map((r: any) => r.course_id);
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds);

    if (coursesError) {
      console.error('Error fetching course details:', coursesError);
      throw coursesError;
    }

    // Step 4: Save recommendations to database
    const recommendationInserts = recommendations.map((rec: any) => ({
      student_response_id: savedResponse.id,
      course_id: rec.course_id,
      similarity_score: rec.match_score / 100 // Convert percentage to decimal
    }));

    const { error: saveRecError } = await supabase
      .from('recommendations')
      .insert(recommendationInserts);

    if (saveRecError) {
      console.error('Error saving recommendations:', saveRecError);
    }

    // Step 5: Format and return recommendations
    const formattedRecommendations = recommendations.map((rec: any) => {
      const course = courses.find((c: any) => c.id === rec.course_id);
      return {
        id: course.id,
        title: course.title,
        university: course.university,
        field: course.field,
        matchPercentage: rec.match_score,
        duration: course.duration,
        location: course.location,
        description: course.description,
        keySubjects: course.key_subjects,
        careerProspects: course.career_prospects,
        entryRequirements: course.entry_requirements,
        averageSalary: course.average_salary,
        employmentRate: course.employment_rate,
        similarityScore: rec.match_score / 100
      };
    });

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


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Starting course embedding generation...');

    // Get all courses that don't have embeddings
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .is('embedding', null);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      throw coursesError;
    }

    console.log(`Found ${courses.length} courses without embeddings`);

    if (courses.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All courses already have embeddings',
          coursesProcessed: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let successCount = 0;
    let failureCount = 0;

    // Process courses in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(courses.length/batchSize)}`);

      // Process each course in the batch
      for (const course of batch) {
        try {
          const courseText = `
            Title: ${course.title}
            University: ${course.university}
            Field: ${course.field}
            Description: ${course.description}
            Key Subjects: ${course.key_subjects.join(', ')}
            Career Prospects: ${course.career_prospects.join(', ')}
          `.trim();

          console.log(`Generating embedding for course: ${course.title}`);
          
          const courseEmbeddingData = await makeOpenAIRequest(
            'https://api.openai.com/v1/embeddings',
            {
              model: 'text-embedding-3-large',
              input: courseText,
              dimensions: 3072
            },
            openaiApiKey
          );

          const courseEmbedding = courseEmbeddingData.data[0].embedding;

          // Update course with embedding
          const { error: updateError } = await supabase
            .from('courses')
            .update({ embedding: courseEmbedding })
            .eq('id', course.id);

          if (updateError) {
            console.error(`Failed to update course ${course.title}:`, updateError);
            failureCount++;
          } else {
            console.log(`Successfully generated embedding for course: ${course.title}`);
            successCount++;
          }

        } catch (error) {
          console.error(`Failed to generate embedding for course ${course.title}:`, error);
          failureCount++;
        }
      }

      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < courses.length) {
        console.log('Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Embedding generation complete. Success: ${successCount}, Failures: ${failureCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        coursesProcessed: successCount,
        failures: failureCount,
        message: `Successfully generated embeddings for ${successCount} courses`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-course-embeddings:', error);
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

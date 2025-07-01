
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);

  const generateCourseEmbeddings = async () => {
    setIsGenerating(true);
    setGenerationStatus('Starting embedding generation...');

    try {
      console.log('Calling generate-course-embeddings function...');
      
      const { data, error } = await supabase.functions.invoke('generate-course-embeddings', {
        body: {}
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message);
      }

      console.log('Embedding generation response:', data);
      
      if (data.success) {
        setGenerationStatus(`Successfully generated embeddings for ${data.coursesProcessed} courses. Failures: ${data.failures || 0}`);
        toast.success(`Embeddings generated successfully! Processed ${data.coursesProcessed} courses.`);
      } else {
        throw new Error(data.error || 'Failed to generate embeddings');
      }

    } catch (error) {
      console.error('Error generating embeddings:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setGenerationStatus(`Error: ${errorMessage}`);
      toast.error(`Failed to generate embeddings: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>
          Generate embeddings for courses to enable course recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button 
            onClick={generateCourseEmbeddings}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Embeddings...' : 'Generate Course Embeddings'}
          </Button>
        </div>
        
        {generationStatus && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{generationStatus}</p>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>What this does:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Finds all courses without embeddings</li>
            <li>Generates AI embeddings for each course using OpenAI</li>
            <li>Processes courses in batches to avoid rate limits</li>
            <li>Updates the database with the generated embeddings</li>
          </ul>
          <p className="mt-3">
            <strong>Note:</strong> This needs to be run once before course recommendations will work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;

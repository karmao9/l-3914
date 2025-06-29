
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudentResponses {
  currentProgram: string;
  favoriteSubjects: string;
  difficultSubjects: string;
  strengths: string;
  taskPreference: string;
  careerInterests: string;
}

interface CourseRecommendation {
  id: string;
  title: string;
  university: string;
  field: string;
  matchPercentage: number;
  duration: string;
  location: string;
  description: string;
  keySubjects: string[];
  careerProspects: string[];
  entryRequirements: string;
  averageSalary: string;
  employmentRate: string;
  similarityScore: number;
}

interface RecommendationResponse {
  success: boolean;
  recommendations: CourseRecommendation[];
  studentResponseId: string;
  error?: string;
}

export const useRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async (responses: StudentResponses) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating recommendations for:', responses);
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'generate-course-recommendations',
        {
          body: {
            studentResponses: {
              currentProgram: responses.currentProgram,
              favoriteSubjects: responses.favoriteSubjects,
              difficultSubjects: responses.difficultSubjects,
              strengths: responses.strengths,
              taskPreference: responses.taskPreference,
              careerInterests: responses.careerInterests,
            }
          }
        }
      );

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      const response = data as RecommendationResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate recommendations');
      }

      console.log('Generated recommendations:', response.recommendations);
      setRecommendations(response.recommendations);
      return response.recommendations;
      
    } catch (err) {
      console.error('Error generating recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateRecommendations,
    recommendations,
    loading,
    error,
    setRecommendations
  };
};

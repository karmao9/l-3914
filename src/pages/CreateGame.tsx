
import { useState, useEffect } from 'react';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useRecommendations } from '@/hooks/useRecommendations';

const assessmentCategories = [
  { id: 'education', name: 'Education Background', icon: <span className="text-lg">📚</span> },
  { id: 'interests', name: 'Personal Interests', icon: <span className="text-lg">💡</span> },
  { id: 'skills', name: 'Skills & Strengths', icon: <span className="text-lg">🎯</span> },
  { id: 'career', name: 'Career Goals', icon: <span className="text-lg">🚀</span> },
  { id: 'preferences', name: 'Study Preferences', icon: <span className="text-lg">⚙️</span> },
];

const CreateGame = () => {
  const [responses, setResponses] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [initialResponses, setInitialResponses] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { generateRecommendations } = useRecommendations();

  useEffect(() => {
    // Get initial responses from sessionStorage
    const stored = sessionStorage.getItem('initialResponses');
    if (stored) {
      setInitialResponses(JSON.parse(stored));
    }
  }, []);

  const handleAnalyze = async () => {
    // Check if we have initial responses
    if (!initialResponses) {
      toast({
        title: "Missing Information",
        description: "Please complete the initial questionnaire first.",
        variant: "destructive",
      });
      navigate('/find-course');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Use only the initial responses from the find course page
      const studentResponses = {
        currentProgram: initialResponses.currentProgram || 'Not specified',
        favoriteSubjects: initialResponses.favoriteSubjects || 'Not specified',
        difficultSubjects: initialResponses.difficultSubjects || 'Not specified',
        strengths: initialResponses.strengths || 'Not specified',
        taskPreference: initialResponses.taskPreference || 'Not specified',
        careerInterests: initialResponses.careerInterests || 'Not specified'
      };

      console.log('Generating recommendations with:', studentResponses);
      await generateRecommendations(studentResponses);
      
      toast({
        title: "Analysis Complete!",
        description: "Your personalized course recommendations are ready.",
      });
      
      navigate('/recommendations');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      // Check if it's a rate limiting error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isRateLimitError = errorMessage.includes('Too Many Requests') || 
                               errorMessage.includes('429') || 
                               errorMessage.includes('rate limit');
      
      toast({
        title: isRateLimitError ? "Rate Limit Exceeded" : "Analysis Failed",
        description: isRateLimitError 
          ? "The OpenAI API rate limit has been exceeded. Please wait a few minutes and try again."
          : "There was an error generating your recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const goBack = () => {
    navigate('/find-course');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-arcade-dark">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Questions</span>
        </button>
        
        {/* Icon at the top */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-arcade-terminal flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <div className="text-3xl">🎓</div>
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 tracking-tight">
          Ready for Your Recommendations
        </h1>
        <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          Based on your responses, we'll use AI to find the perfect course matches for you.
        </p>

        {/* Show initial responses summary */}
        {initialResponses && (
          <div className="bg-arcade-terminal/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800 max-w-4xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Your Responses:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Current Program:</span> {initialResponses.currentProgram}
              </div>
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Favorite Subjects:</span> {initialResponses.favoriteSubjects}
              </div>
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Difficult Subjects:</span> {initialResponses.difficultSubjects}
              </div>
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Strengths:</span> {initialResponses.strengths}
              </div>
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Task Preference:</span> {initialResponses.taskPreference}
              </div>
              <div className="text-gray-300">
                <span className="text-arcade-purple font-medium">Career Interests:</span> {initialResponses.careerInterests}
              </div>
            </div>
          </div>
        )}
        
        {/* Generate recommendations button */}
        <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Generate Your Course Recommendations</h3>
            <p className="text-sm text-gray-400 mb-6">
              Our AI will analyze your responses and match you with the most suitable courses from our database.
            </p>
            
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !initialResponses}
              className="bg-arcade-purple hover:bg-opacity-90 text-white rounded-lg px-8 py-3 flex items-center font-medium disabled:opacity-70 mx-auto"
            >
              <Sparkles size={18} className="mr-2" />
              {isAnalyzing ? 'Analyzing Your Profile...' : 'Get My Recommendations'}
            </button>
          </div>
        </div>
        
        {/* Assessment categories */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {assessmentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                selectedCategory === category.id 
                  ? 'bg-arcade-purple/20 border-arcade-purple text-white' 
                  : 'bg-arcade-terminal/40 border-gray-700 text-gray-300 hover:bg-arcade-terminal/60'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* Information section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">How Our AI Recommendation Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">🧠 AI Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Analyzes your academic background</li>
                <li>• Considers your interests and strengths</li>
                <li>• Matches with career preferences</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">📊 Smart Matching</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Uses advanced algorithms</li>
                <li>• Compares with course database</li>
                <li>• Calculates compatibility scores</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">🎯 Personalized Results</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Top 5 course recommendations</li>
                <li>• Match percentages included</li>
                <li>• Detailed course information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;


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
    if (!responses.trim()) {
      toast({
        title: "Please provide your responses",
        description: "Tell us more about your academic background, interests, and goals",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Combine initial responses with detailed responses
      const combinedResponses = {
        currentProgram: initialResponses?.currentProgram || 'Not specified',
        favoriteSubjects: initialResponses?.favoriteSubjects || 'Not specified',
        difficultSubjects: initialResponses?.difficultSubjects || 'Not specified',
        strengths: initialResponses?.strengths || 'Not specified',
        taskPreference: initialResponses?.taskPreference || 'Not specified',
        careerInterests: `${initialResponses?.careerInterests || ''} ${responses}`.trim()
      };

      await generateRecommendations(combinedResponses);
      
      toast({
        title: "Analysis Complete!",
        description: "Your personalized course recommendations are ready.",
      });
      
      navigate('/recommendations');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating your recommendations. Please try again.",
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
          Tell us more about yourself
        </h1>
        <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          Based on your initial responses, help us understand you better to provide more accurate course recommendations.
        </p>

        {/* Show initial responses summary */}
        {initialResponses && (
          <div className="bg-arcade-terminal/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800 max-w-4xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Your Initial Responses:</h3>
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
        
        {/* Course assessment area */}
        <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Additional Details:</h3>
            <p className="text-sm text-gray-400 mb-4">
              Share more specific information about your goals, interests, or any other details that might help us recommend the perfect course for you.
            </p>
          </div>
          
          <textarea
            value={responses}
            onChange={(e) => setResponses(e.target.value)}
            placeholder="Example: I'm particularly interested in working with technology in healthcare. I enjoy solving complex problems and have always been fascinated by how data can improve patient outcomes. I'm also interested in the business side of healthcare and would like to understand how to manage healthcare systems effectively..."
            className="w-full bg-arcade-terminal border border-gray-700 rounded-lg p-4 min-h-32 text-white focus:outline-none focus:ring-2 focus:ring-arcade-purple resize-none"
          />
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-arcade-purple hover:bg-opacity-90 text-white rounded-lg px-6 py-2 flex items-center font-medium disabled:opacity-70"
            >
              <Sparkles size={18} className="mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Get My Recommendations'}
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
        
        {/* Questions section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Consider These Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">🎯 Future Goals</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• What impact do you want to make?</li>
                <li>• Where do you see yourself in 5-10 years?</li>
                <li>• What type of work environment appeals to you?</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">💡 Specific Interests</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• What topics fascinate you most?</li>
                <li>• What problems do you want to solve?</li>
                <li>• What industries excite you?</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">🎯 Learning Style</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Do you prefer hands-on or theoretical learning?</li>
                <li>• Do you like working in teams or independently?</li>
                <li>• What motivates you to learn?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;

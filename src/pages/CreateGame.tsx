
import { useState } from 'react';
import { Share2, Download, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!responses.trim()) {
      toast({
        title: "Please provide your responses",
        description: "Tell us about your academic background, interests, and goals",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis and redirect to results
    setTimeout(() => {
      toast({
        title: "Analysis Complete!",
        description: "Your personalized course recommendations are ready.",
      });
      setIsAnalyzing(false);
      navigate('/workspace');
    }, 2000);
  };

  const goBack = () => {
    navigate('/');
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
          <span>Back to home</span>
        </button>
        
        {/* Icon at the top */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-arcade-terminal flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <div className="text-3xl">🎓</div>
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-16 tracking-tight">
          Discover your ideal course path.
        </h1>
        
        {/* Course assessment area */}
        <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Tell us about yourself:</h3>
            <p className="text-sm text-gray-400 mb-4">
              Share information about your education, interests, skills, and career goals to get personalized recommendations.
            </p>
          </div>
          
          <textarea
            value={responses}
            onChange={(e) => setResponses(e.target.value)}
            placeholder="Example: I'm currently in Year 12 studying Biology, Chemistry, and Math. I enjoy problem-solving and helping others. I find creative writing challenging but I'm good at logical thinking. I'm interested in healthcare careers..."
            className="w-full bg-arcade-terminal border border-gray-700 rounded-lg p-4 min-h-32 text-white focus:outline-none focus:ring-2 focus:ring-arcade-purple resize-none"
          />
          
          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="flex space-x-3">
              <button className="p-2 text-gray-400 hover:text-white">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <Download size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-1.5 text-sm border border-gray-700 rounded-lg bg-arcade-terminal/80">
                <Lock size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-300">Private</span>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-arcade-purple hover:bg-opacity-90 text-white rounded-lg px-6 py-2 flex items-center font-medium disabled:opacity-70"
              >
                <Sparkles size={18} className="mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </div>
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
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Sample Assessment Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">📚 Education</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• What program/course are you currently taking?</li>
                <li>• What subjects do you enjoy most?</li>
                <li>• What subjects are most challenging?</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">🎯 Skills</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• What are your key strengths?</li>
                <li>• Do you prefer logical or creative tasks?</li>
                <li>• What activities energize you?</li>
              </ul>
            </div>
            
            <div className="bg-arcade-terminal/20 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-arcade-purple mb-2">💡 Interests</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• What topics fascinate you?</li>
                <li>• What career fields interest you?</li>
                <li>• What impact do you want to make?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;

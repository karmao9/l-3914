
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

const questions = [
  {
    id: 'program',
    text: 'Which Program/Course are you currently taking?',
    category: 'education',
    style: 'font-serif text-xl font-bold text-blue-300 border-l-4 border-blue-400 pl-4 bg-blue-900/20 rounded-r-lg py-3'
  },
  {
    id: 'enjoy_subjects',
    text: 'What subjects do you enjoy the most?',
    category: 'education',
    style: 'font-mono text-lg text-green-300 bg-gradient-to-r from-green-900/30 to-transparent p-3 rounded-lg border border-green-700'
  },
  {
    id: 'difficult_subjects',
    text: 'What subjects do you find most difficult or less enjoyable?',
    category: 'education',
    style: 'font-sans text-base italic text-yellow-300 shadow-lg bg-yellow-900/20 p-4 rounded-xl border-2 border-dashed border-yellow-600'
  },
  {
    id: 'strengths',
    text: 'What are some of your strengths or skills?',
    category: 'skills',
    style: 'font-bold text-lg tracking-wide text-purple-300 bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-3 rounded-lg border border-purple-500 shadow-purple-500/25 shadow-lg'
  },
  {
    id: 'logical_creative',
    text: 'Do you prefer tasks that are more logical or more creative?',
    category: 'skills',
    style: 'font-light text-xl text-orange-300 border-t-4 border-b-4 border-orange-500 py-4 px-2 bg-orange-900/10 italic'
  },
  {
    id: 'career_fields',
    text: 'What career fields interest you most?',
    category: 'interests',
    style: 'font-extrabold text-lg uppercase tracking-widest text-red-300 bg-red-900/25 p-4 rounded-md border-l-8 border-red-500 shadow-inner'
  }
];

const CreateGame = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isAllQuestionsAnswered = () => {
    return questions.every(q => responses[q.id]?.trim());
  };

  const handleGenerate = () => {
    if (!isAllQuestionsAnswered()) {
      toast({
        title: "Please answer all questions",
        description: "Complete all assessment questions to get your recommendations",
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
      navigate('/recommendations');
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
        
        {/* Assessment Questions */}
        <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Assessment Questions</h3>
            <p className="text-sm text-gray-400 mb-6">
              Answer all questions below to get personalized course recommendations based on your profile.
            </p>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <div className={question.style}>
                  {question.text}
                </div>
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder="Enter your response here..."
                  className="w-full bg-arcade-terminal border border-gray-700 rounded-lg p-3 min-h-20 text-white focus:outline-none focus:ring-2 focus:ring-arcade-purple resize-none text-sm"
                />
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-6">
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
                onClick={handleGenerate}
                disabled={!isAllQuestionsAnswered() || isAnalyzing}
                className={`rounded-lg px-8 py-3 flex items-center font-medium transition-all ${
                  isAllQuestionsAnswered() && !isAnalyzing
                    ? 'bg-arcade-purple hover:bg-opacity-90 text-white shadow-lg shadow-arcade-purple/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles size={18} className="mr-2" />
                {isAnalyzing ? 'Generating...' : 'Generate'}
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
      </div>
    </div>
  );
};

export default CreateGame;

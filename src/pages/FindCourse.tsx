
import { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Brain, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Terminal from '@/components/Terminal';

const FindCourse = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-arcade-dark">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-arcade-terminal flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <div className="text-lg">🧠</div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">InteliCourse</h1>
            <p className="text-xs text-gray-400">Course Recommendation System</p>
          </div>
        </div>
        
        <button 
          onClick={goBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Main Title */}
        <div className={`text-center mb-8 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Find Your Perfect University Course
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            An intelligent system to help high school leavers choose suitable university courses 
            based on their interests, skills, and career goals using Machine Learning.
          </p>
        </div>

        {/* Terminal Component */}
        <div className={`transition-opacity duration-700 delay-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <Terminal />
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-opacity duration-700 delay-400 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center">
            <div className="w-16 h-16 bg-arcade-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} className="text-arcade-purple" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Education Assessment</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Answer questions about your current program, favorite subjects, and 
              academic challenges to get personalized recommendations
            </p>
          </div>

          <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center">
            <div className="w-16 h-16 bg-arcade-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain size={32} className="text-arcade-purple" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Interest & Skills Analysis</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover courses that match your strengths, whether you prefer logical 
              thinking or creative expression
            </p>
          </div>

          <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center">
            <div className="w-16 h-16 bg-arcade-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-arcade-purple" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Career Goal Matching</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get course recommendations aligned with your future career aspirations 
              using advanced ML algorithms
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Course Compass. Helping students find their path.</p>
        </div>
      </footer>
    </div>
  );
};

export default FindCourse;

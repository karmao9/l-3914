import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';
import EmailForm from '@/components/EmailForm';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/find-course');
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
        
        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="bg-arcade-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Not Sure What to Study? We've Got You.
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-200">
                  Find the Right Course with AI-Powered Guidance
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Take the guesswork out of choosing a university path. Our smart system 
                  analyzes your interests, strengths, and goals to recommend the courses 
                  that fit you best.
                </p>
              </div>
              
              <button 
                onClick={handleGetStarted}
                className="bg-arcade-purple hover:bg-opacity-90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors inline-flex items-center"
              >
                <Sparkles size={18} className="mr-2" />
                Get Started
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">10+</div>
                <div className="text-gray-400 text-sm">years of experience</div>
              </div>
              
              <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">600+</div>
                <div className="text-gray-400 text-sm">Recommendation</div>
              </div>
              
              <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">800+</div>
                <div className="text-gray-400 text-sm">Happy Clients</div>
              </div>
            </div>

            {/* Email Form */}
            <EmailForm />
          </div>
          
          {/* Right Content - Hero Image */}
          <div className={`flex justify-center transition-opacity duration-700 delay-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
              <img 
                src="/lovable-uploads/a5f5ab03-bc7b-4f2b-9f8d-89c935ac1a49.png" 
                alt="Happy student with glasses in pink sweater with colorful geometric background"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 InteliCourse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            <span className="text-orange-500">inteli</span>
            <span className="text-gray-800">COURSE</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="px-6 py-2 text-orange-500 hover:text-orange-600 font-medium border border-orange-500 rounded-full hover:bg-orange-50 transition-colors">
            Login
          </button>
          <button className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Not Sure What to Study? We've Got You.
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Find the Right Course with AI-Powered Guidance
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Take the guesswork out of choosing a university path. Our smart system 
                  analyzes your interests, strengths, and goals to recommend the courses 
                  that fit you best.
                </p>
              </div>
              
              <button 
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors inline-flex items-center"
              >
                Get Started
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">10+</div>
                <div className="text-gray-600 text-sm">years of experience</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">600+</div>
                <div className="text-gray-600 text-sm">Recommendation</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">800+</div>
                <div className="text-gray-600 text-sm">Happy Clients</div>
              </div>
            </div>
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
    </div>
  );
};

export default Index;

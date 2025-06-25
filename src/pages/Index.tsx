
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Terminal from '@/components/Terminal';
import EmailForm from '@/components/EmailForm';
import FeatureCard from '@/components/FeatureCard';
import { GraduationCap, Brain, Target } from 'lucide-react';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Add small delay before starting animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-arcade-dark">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        
        <div className={`mt-16 mb-12 text-center transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Find Your Perfect University Course</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            An intelligent system to help high school leavers choose suitable university courses based on their interests, skills, and career goals using Machine Learning.
          </p>
        </div>
        
        <Terminal />
        
        <EmailForm />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 mb-16">
          <FeatureCard 
            icon={<GraduationCap size={28} />}
            title="Education Assessment"
            description="Answer questions about your current program, favorite subjects, and academic challenges to get personalized recommendations"
            delay="delay-100"
          />
          
          <FeatureCard 
            icon={<Brain size={28} />}
            title="Interest & Skills Analysis"
            description="Discover courses that match your strengths, whether you prefer logical thinking or creative expression"
            delay="delay-300"
          />
          
          <FeatureCard 
            icon={<Target size={28} />}
            title="Career Goal Matching"
            description="Get course recommendations aligned with your future career aspirations using advanced ML algorithms"
            delay="delay-500"
          />
        </div>
      </div>
      
      <footer className="py-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© 2025 Course Compass. Helping students find their path.</p>
      </footer>
    </div>
  );
};

export default Index;

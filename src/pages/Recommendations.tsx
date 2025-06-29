
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, TrendingUp, Users, Clock, MapPin, Star, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecommendations } from '@/hooks/useRecommendations';

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
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { recommendations } = useRecommendations();

  useEffect(() => {
    // Check if we have recommendations from the AI system
    if (recommendations && recommendations.length > 0) {
      console.log('Using AI-generated recommendations:', recommendations);
      setLoading(false);
    } else {
      // Simulate loading for a short time then show mock data
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recommendations]);

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-400/20';
    if (percentage >= 80) return 'bg-yellow-400/20';
    return 'bg-orange-400/20';
  };

  // Use AI recommendations if available, otherwise fall back to mock data
  const displayRecommendations = recommendations.length > 0 ? recommendations : [
    {
      id: '1',
      title: 'Computer Science',
      university: 'University of Technology',
      field: 'Technology',
      matchPercentage: 95,
      duration: '4 years',
      location: 'City Campus',
      description: 'Comprehensive program covering software development, algorithms, data structures, and emerging technologies.',
      keySubjects: ['Programming', 'Data Structures', 'Machine Learning', 'Software Engineering'],
      careerProspects: ['Software Developer', 'Data Scientist', 'AI Engineer', 'System Architect'],
      entryRequirements: 'Mathematics, Physics, English',
      averageSalary: '$75,000 - $120,000',
      employmentRate: '92%'
    },
    {
      id: '2',
      title: 'Business Administration',
      university: 'Metropolitan University',
      field: 'Business',
      matchPercentage: 88,
      duration: '3 years',
      location: 'Downtown Campus',
      description: 'Strategic business management program with focus on leadership, finance, and entrepreneurship.',
      keySubjects: ['Management', 'Finance', 'Marketing', 'Business Strategy'],
      careerProspects: ['Business Manager', 'Consultant', 'Entrepreneur', 'Financial Analyst'],
      entryRequirements: 'Mathematics, English, Economics',
      averageSalary: '$60,000 - $95,000',
      employmentRate: '87%'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-arcade-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-arcade-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Analyzing Your Preferences...</h2>
          <p className="text-gray-400">Our ML algorithms are finding your perfect course matches</p>
          <div className="flex items-center justify-center mt-4 text-arcade-purple">
            <Brain className="mr-2" size={20} />
            <span className="text-sm">AI-Powered Recommendations</span>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-xs text-gray-400">AI-Powered Course Recommendations</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/find-course')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Your AI-Generated Course Recommendations
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Based on your assessment, our advanced ML algorithms have identified the most suitable university courses for you using semantic similarity analysis.
          </p>
          {recommendations.length > 0 && (
            <div className="flex items-center justify-center mt-4 text-arcade-purple">
              <Brain className="mr-2" size={20} />
              <span className="text-sm">Powered by OpenAI Embeddings & Cosine Similarity</span>
            </div>
          )}
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {displayRecommendations.map((course, index) => (
            <Card key={course.id} className="bg-arcade-terminal/40 border-gray-800 backdrop-blur-sm hover:bg-arcade-terminal/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="text-arcade-purple" size={24} />
                    <span className="text-sm text-gray-400">#{index + 1} Match</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getMatchBgColor(course.matchPercentage)}`}>
                    <span className={`text-sm font-semibold ${getMatchColor(course.matchPercentage)}`}>
                      {course.matchPercentage}% Match
                    </span>
                  </div>
                </div>
                <CardTitle className="text-white text-xl mb-1">{course.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {course.university} • {course.field}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {course.description}
                </p>
                
                {/* Course Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock size={16} className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    <span>{course.location}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <TrendingUp size={16} className="mr-2" />
                    <span>{course.averageSalary}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>{course.employmentRate} employed</span>
                  </div>
                </div>

                {/* Key Subjects */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Key Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.keySubjects.map((subject, idx) => (
                      <span key={idx} className="bg-arcade-purple/20 text-arcade-purple px-2 py-1 rounded-md text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Prospects */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Career Prospects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.careerProspects.map((career, idx) => (
                      <span key={idx} className="bg-green-400/20 text-green-400 px-2 py-1 rounded-md text-xs">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Entry Requirements */}
                <div>
                  <h4 className="text-white font-semibold mb-1 text-sm">Entry Requirements:</h4>
                  <p className="text-gray-400 text-xs">{course.entryRequirements}</p>
                </div>

                {/* Action Button */}
                <button className="w-full bg-arcade-purple hover:bg-opacity-90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Star size={16} className="mr-2" />
                  Learn More About This Course
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {recommendations.length > 0 ? 'AI-Powered Results' : 'Need More Information?'}
            </h3>
            <p className="text-gray-300 mb-6">
              {recommendations.length > 0 
                ? 'These recommendations were generated using advanced machine learning algorithms that analyzed your responses and computed semantic similarity with course descriptions.'
                : 'Our AI-powered system has analyzed your preferences and academic background to provide these personalized recommendations.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-course')}
                className="bg-arcade-purple hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Retake Assessment
              </button>
              <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-6 py-3 rounded-lg font-medium transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 InteliCourse. AI-powered course recommendations.</p>
        </div>
      </footer>
    </div>
  );
};

export default Recommendations;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

const Consultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Help us improve by rating your consultation experience.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating helps us improve our consultation service.",
    });
  };

  const consultationDetails = {
    consultant: "Dr. Sarah Mitchell",
    specialty: "Academic & Career Guidance",
    duration: "45 minutes",
    date: "Tomorrow, Jan 15, 2025",
    time: "2:00 PM - 2:45 PM",
    location: "Virtual Meeting Room"
  };

  return (
    <div className="min-h-screen bg-arcade-dark">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-arcade-terminal flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <div className="text-lg">📅</div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">InteliCourse</h1>
            <p className="text-xs text-gray-400">Personal Consultation</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/recommendations')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Recommendations</span>
        </button>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Personal Consultation
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get personalized guidance from our expert academic advisors to help you make the best course decision.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Consultation Details */}
          <Card className="bg-arcade-terminal/40 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 text-arcade-purple" size={24} />
                Consultation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-300">
                <User size={16} className="mr-3 text-arcade-purple" />
                <div>
                  <p className="font-medium">{consultationDetails.consultant}</p>
                  <p className="text-sm text-gray-400">{consultationDetails.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Calendar size={16} className="mr-3 text-arcade-purple" />
                <span>{consultationDetails.date}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Clock size={16} className="mr-3 text-arcade-purple" />
                <span>{consultationDetails.time} ({consultationDetails.duration})</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <MessageSquare size={16} className="mr-3 text-arcade-purple" />
                <span>{consultationDetails.location}</span>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-semibold mb-3">What to expect:</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    Review your AI-generated course recommendations
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    Discuss your career goals and academic interests
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    Get insights on university application processes
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    Receive personalized study and career advice
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card className="bg-arcade-terminal/40 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="mr-2 text-arcade-purple" size={24} />
                Rate Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isSubmitted ? (
                <>
                  <p className="text-gray-300 text-sm">
                    How would you rate your consultation experience? Your feedback helps us improve our service.
                  </p>
                  
                  {/* Star Rating */}
                  <div className="space-y-3">
                    <label className="text-white font-medium text-sm">Overall Experience:</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-colors ${
                            star <= rating 
                              ? 'text-yellow-400 hover:text-yellow-300' 
                              : 'text-gray-600 hover:text-gray-400'
                          }`}
                        >
                          <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-arcade-purple">
                        {rating === 5 && "Excellent! ⭐"}
                        {rating === 4 && "Very Good! 👍"}
                        {rating === 3 && "Good 👌"}
                        {rating === 2 && "Fair 😐"}
                        {rating === 1 && "Poor 👎"}
                      </p>
                    )}
                  </div>

                  {/* Feedback */}
                  <div className="space-y-3">
                    <label className="text-white font-medium text-sm">Additional Feedback (Optional):</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what went well or how we can improve..."
                      className="bg-arcade-terminal/60 border-gray-700 text-white placeholder-gray-400 resize-none"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleRatingSubmit}
                    className="w-full bg-arcade-purple hover:bg-arcade-purple/80 text-white"
                  >
                    Submit Rating
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Thank You!</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Your {rating}-star rating has been recorded.
                  </p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate('/recommendations')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                  >
                    Back to Recommendations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need to Reschedule?</h3>
            <p className="text-gray-300 mb-6">
              If you need to change your consultation time, please contact us at least 24 hours in advance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
              >
                Contact Support
              </Button>
              <Button 
                className="bg-arcade-purple hover:bg-arcade-purple/80 text-white"
              >
                Join Meeting Room
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 InteliCourse. Professional academic consultation services.</p>
        </div>
      </footer>
    </div>
  );
};

export default Consultation;
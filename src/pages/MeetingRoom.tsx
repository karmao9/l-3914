import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare, 
  Settings, 
  Users,
  Share,
  MoreVertical,
  Send,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Mitchell',
      message: 'Welcome to our consultation! I\'ve reviewed your AI-generated recommendations.',
      time: '2:01 PM',
      isConsultant: true
    },
    {
      id: 2,
      sender: 'Dr. Sarah Mitchell',
      message: 'Let\'s discuss your top course matches and answer any questions you have.',
      time: '2:01 PM',
      isConsultant: true
    }
  ]);
  const [meetingDuration, setMeetingDuration] = useState(0);

  useEffect(() => {
    // Meeting timer
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);

    // Welcome message
    toast({
      title: "Meeting Started",
      description: "You've joined the consultation with Dr. Sarah Mitchell",
    });

    return () => clearInterval(timer);
  }, [toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'You',
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isConsultant: false
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const handleEndCall = () => {
    toast({
      title: "Meeting Ended",
      description: "Thank you for your consultation session!",
    });
    navigate('/consultation');
  };

  return (
    <div className="min-h-screen bg-arcade-dark flex flex-col">
      {/* Header */}
      <header className="bg-arcade-terminal/40 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-arcade-purple flex items-center justify-center">
              <span className="text-white text-sm">🎓</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">Course Consultation</h1>
              <p className="text-gray-400 text-sm">with Dr. Sarah Mitchell</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-400">
              <Clock size={16} className="mr-2" />
              <span className="text-sm">{formatTime(meetingDuration)}</span>
            </div>
            <div className="flex items-center text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Consultant Video */}
            <Card className="bg-arcade-terminal/60 border-gray-700 relative overflow-hidden">
              <CardContent className="p-0 h-full min-h-[300px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-arcade-purple/20 to-arcade-terminal/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-arcade-purple/30 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👩‍⚕️</span>
                    </div>
                    <h3 className="text-white font-semibold">Dr. Sarah Mitchell</h3>
                    <p className="text-gray-400 text-sm">Academic Advisor</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-1">
                  <span className="text-white text-sm">Dr. Sarah Mitchell</span>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Mic size={16} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Video */}
            <Card className="bg-arcade-terminal/60 border-gray-700 relative overflow-hidden">
              <CardContent className="p-0 h-full min-h-[300px] relative">
                {isVideoOn ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-arcade-terminal/40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👤</span>
                      </div>
                      <h3 className="text-white font-semibold">You</h3>
                      <p className="text-gray-400 text-sm">Student</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Camera is off</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-1">
                  <span className="text-white text-sm">You</span>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAudioOn ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isAudioOn ? (
                      <Mic size={16} className="text-white" />
                    ) : (
                      <MicOff size={16} className="text-white" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meeting Controls */}
          <div className="bg-arcade-terminal/40 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsAudioOn(!isAudioOn)}
                className="rounded-full w-12 h-12 p-0"
              >
                {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full w-12 h-12 p-0"
              >
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
              >
                <Phone size={20} />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-12 h-12 p-0 border-gray-600"
              >
                <MessageSquare size={20} />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12 p-0 border-gray-600"
              >
                <Share size={20} />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12 p-0 border-gray-600"
              >
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-arcade-terminal/60 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Chat
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`${msg.isConsultant ? '' : 'text-right'}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    msg.isConsultant 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-arcade-purple text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{msg.sender}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-arcade-terminal border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="bg-arcade-purple hover:bg-arcade-purple/80"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-arcade-terminal/40 border-t border-gray-800 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Participants: 2</span>
            <span>Quality: HD</span>
            <span>Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>Waiting room: Empty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRecommendations } from '@/hooks/useRecommendations';

const Terminal = () => {
  const [terminalText, setTerminalText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setRecommendations } = useRecommendations();

  const questions = [
    { text: "Which Program/Course are you currently taking?", color: "text-blue-400", underlineColor: "border-blue-400" },
    { text: "What subjects do you enjoy the most?", color: "text-green-400", underlineColor: "border-green-400" },
    { text: "What subjects do you find most difficult or less enjoyable?", color: "text-red-400", underlineColor: "border-red-400" },
    { text: "What are some of your strengths or skills?", color: "text-yellow-400", underlineColor: "border-yellow-400" },
    { text: "Do you prefer tasks that are more logical or more creative?", color: "text-purple-400", underlineColor: "border-purple-400" },
    { text: "What career fields interest you most?", color: "text-cyan-400", underlineColor: "border-cyan-400" }
  ];

  // Terminal animation sequence
  useEffect(() => {
    const lines = [
      { text: "$ ", delay: 500 },
      { text: "course-compass --start-assessment", delay: 100, finalDelay: 800 },
      { text: "\n✨ Initializing Course Recommendation System...", delay: 50, finalDelay: 500 },
      { text: "\nLoading ML algorithms...", delay: 50, finalDelay: 500 },
      { text: "\nReady to analyze your preferences...", delay: 50, finalDelay: 700 },
      { text: "\n🎓 Let's find your perfect course! Answer the following questions:", delay: 50, finalDelay: 1000 }
    ];

    let currentText = '';
    let timeoutId: NodeJS.Timeout;
    let currentLineIndex = 0;
    let currentCharIndex = 0;

    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setAnimationComplete(true);
        startQuestions();
        return;
      }

      const currentLine = lines[currentLineIndex];
      
      if (currentCharIndex < currentLine.text.length) {
        currentText += currentLine.text[currentCharIndex];
        setTerminalText(currentText);
        currentCharIndex++;
        
        timeoutId = setTimeout(typeNextChar, currentLine.delay);
      } else {
        currentLineIndex++;
        currentCharIndex = 0;
        timeoutId = setTimeout(typeNextChar, currentLine.finalDelay || 0);
      }

      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };

    timeoutId = setTimeout(typeNextChar, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const startQuestions = () => {
    setTimeout(() => {
      setIsWaitingForInput(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };

  const handleInputSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const newResponses = [...userResponses];
      newResponses[currentQuestionIndex] = currentInput.trim();
      setUserResponses(newResponses);
      setCurrentInput('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsWaitingForInput(false);
        setShowSubmitButton(true);
      }
    }
  };

  const handleSubmitAssessment = async () => {
    setShowSubmitButton(false);
    
    setTerminalText(prev => prev + '\n✨ Initial assessment complete! Redirecting to detailed assessment...');
    
    // Store responses in sessionStorage to pass to assessment page
    sessionStorage.setItem('initialResponses', JSON.stringify({
      currentProgram: userResponses[0],
      favoriteSubjects: userResponses[1],
      difficultSubjects: userResponses[2],
      strengths: userResponses[3],
      taskPreference: userResponses[4],
      careerInterests: userResponses[5]
    }));
    
    setTimeout(() => {
      navigate('/assessment');
    }, 1500);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditValue(userResponses[index] || '');
  };

  const handleEditSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editValue.trim()) {
      const newResponses = [...userResponses];
      newResponses[editingIndex!] = editValue.trim();
      setUserResponses(newResponses);
      setEditingIndex(null);
      setEditValue('');
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const renderQuestionsAndAnswers = () => {
    const questionsToShow = questions.slice(0, Math.min(currentQuestionIndex + 1, questions.length));
    
    return questionsToShow.map((question, index) => {
      const isCurrentQuestion = index === currentQuestionIndex && isWaitingForInput;
      const hasAnswer = userResponses[index];
      const isEditing = editingIndex === index;
      
      return (
        <div key={index} className="mb-2">
          <div className={`${question.color} inline`}>
            Question {index + 1}/6: 
            <span className={`underline ${question.underlineColor} decoration-2 underline-offset-2 ml-1`}>
              {question.text}
            </span>
          </div>
          {hasAnswer && !isEditing && (
            <div className="mt-1">
              <span className="text-green-400">&gt;</span>
              <span 
                className="bg-green-900/30 text-green-300 px-2 py-1 rounded ml-1 border border-green-600 cursor-pointer hover:bg-green-900/50"
                onClick={() => handleEditClick(index)}
                title="Click to edit"
              >
                {userResponses[index]}
              </span>
            </div>
          )}
          {isEditing && (
            <div className="mt-1">
              <span className="text-green-400">&gt;</span>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditSubmit}
                className="bg-transparent border-none outline-none text-green-400 font-mono text-sm md:text-base ml-1"
                placeholder="Press Enter to save, Escape to cancel"
                autoFocus
              />
            </div>
          )}
          {isCurrentQuestion && !hasAnswer && (
            <div className="mt-1">
              <span className="text-green-400">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleInputSubmit}
                className="bg-transparent border-none outline-none text-green-400 font-mono text-sm md:text-base ml-1"
                placeholder=""
                disabled={false}
              />
            </div>
          )}
        </div>
      );
    });
  };

  // Cursor blink effect
  useEffect(() => {
    if (animationComplete) {
      const blinkInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }
  }, [animationComplete]);

  return (
    <div className="terminal max-w-2xl mx-auto my-6 opacity-0 animate-fade-in delay-200">
      <div className="terminal-header">
        <div className="terminal-button close-button"></div>
        <div className="terminal-button minimize-button"></div>
        <div className="terminal-button maximize-button"></div>
        <div className="ml-auto text-xs text-gray-400">course-compass-terminal</div>
      </div>
      <div 
        ref={terminalRef}
        className="terminal-content text-sm md:text-base text-green-400 font-mono mt-2 min-h-40 max-h-80 overflow-y-auto relative"
      >
        {terminalText}
        {animationComplete && renderQuestionsAndAnswers()}
        {!isWaitingForInput && animationComplete && userResponses.length === 0 && !showSubmitButton && (
          <span className={`cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
        )}
        {showSubmitButton && (
          <div className="mt-4 flex flex-col items-start gap-3">
            <div className="text-cyan-400 text-sm">
              📋 Review your responses above. Click any answer to edit, or continue to detailed assessment:
            </div>
            <Button 
              onClick={handleSubmitAssessment}
              className="bg-arcade-purple hover:bg-arcade-purple/80 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              disabled={userResponses.length !== questions.length}
            >
              🚀 Continue to Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;

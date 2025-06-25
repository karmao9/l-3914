
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Terminal = () => {
  const [terminalText, setTerminalText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const questions = [
    "Which Program/Course are you currently taking?",
    "What subjects do you enjoy the most?",
    "What subjects do you find most difficult or less enjoyable?",
    "What are some of your strengths or skills?",
    "Do you prefer tasks that are more logical or more creative?",
    "What career fields interest you most?"
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

      // Ensure terminal scrolls to bottom as text is added
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };

    timeoutId = setTimeout(typeNextChar, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const startQuestions = () => {
    setTimeout(() => {
      setTerminalText(prev => prev + `\n\nQuestion ${currentQuestionIndex + 1}/6: ${questions[currentQuestionIndex]}\n> `);
      setIsWaitingForInput(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const newResponses = [...userResponses, currentInput.trim()];
      setUserResponses(newResponses);
      
      setTerminalText(prev => prev + currentInput + '\n');
      setCurrentInput('');
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        
        setTimeout(() => {
          setTerminalText(prev => prev + `\nQuestion ${nextIndex + 1}/6: ${questions[nextIndex]}\n> `);
        }, 500);
      } else {
        setIsWaitingForInput(false);
        setTimeout(() => {
          setTerminalText(prev => prev + '\n✨ Assessment complete! Analyzing your responses...\n🚀 Redirecting to your personalized recommendations...');
          setTimeout(() => {
            navigate('/assessment');
          }, 2000);
        }, 500);
      }
    }
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
        {!isWaitingForInput && (
          <span className={`cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
        )}
        {isWaitingForInput && (
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleInputSubmit}
            className="bg-transparent border-none outline-none text-green-400 font-mono text-sm md:text-base w-full"
            placeholder=""
          />
        )}
      </div>
    </div>
  );
};

export default Terminal;

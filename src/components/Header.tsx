
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-arcade-terminal flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
          <div className="text-lg">🧠</div>
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">InteliCourse</h1>
          <p className="text-xs text-gray-500">Course Recommendation System</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
        <button 
          onClick={() => navigate('/assessment')}
          className="bg-arcade-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Start Assessment
        </button>
      </nav>
      
      <button 
        className="md:hidden text-gray-300 hover:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-arcade-terminal border border-gray-700 rounded-lg p-4 space-y-3 md:hidden z-50">
          <a href="#" className="block text-gray-300 hover:text-white">Features</a>
          <a href="#" className="block text-gray-300 hover:text-white">About</a>
          <button 
            onClick={() => navigate('/assessment')}
            className="w-full bg-arcade-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Start Assessment
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

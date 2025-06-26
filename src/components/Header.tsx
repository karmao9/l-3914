
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    </header>
  );
};

export default Header;

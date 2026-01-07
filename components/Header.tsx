
import React, { useState } from 'react';
import Logo from './Logo';

interface HeaderProps {
  onViewChange: (view: 'home' | 'about' | 'claims' | 'plans') => void;
  currentView: 'home' | 'about' | 'claims' | 'plans';
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: 'home' | 'about' | 'claims' | 'plans') => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-primary text-white text-xs py-2 px-4 flex justify-end gap-6 font-medium">
        <a href="mailto:hello@petcovered.co.za" className="hover:underline flex items-center gap-1 text-[10px] md:text-xs">
          <span className="opacity-80">hello@petcovered.co.za</span>
        </a>
        <a href="tel:0101094015" className="hover:underline text-[10px] md:text-xs">Call us 087 655 0525</a>
      </div>
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <button 
          onClick={() => handleNav('home')} 
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <Logo />
        </button>
        
        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-gray-700">
          <button 
            onClick={() => handleNav('home')} 
            className={`transition-colors ${currentView === 'home' ? 'text-primary' : 'hover:text-primary'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNav('plans')} 
            className={`transition-colors ${currentView === 'plans' ? 'text-primary' : 'hover:text-primary'}`}
          >
            Plans
          </button>
          <button 
            onClick={() => handleNav('about')} 
            className={`transition-colors ${currentView === 'about' ? 'text-primary' : 'hover:text-primary'}`}
          >
            About
          </button>
          <button 
            onClick={() => handleNav('claims')} 
            className={`transition-colors ${currentView === 'claims' ? 'text-primary' : 'hover:text-primary'}`}
          >
            How to Claim
          </button>
          <a href="#faq" className="hover:text-primary transition-colors">FAQs</a>
          <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-md">
            Get Started
          </button>
        </div>

        <button 
          className="md:hidden text-gray-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 font-semibold shadow-xl">
          <button onClick={() => handleNav('home')} className={`block w-full text-left py-2 ${currentView === 'home' ? 'text-primary' : 'text-gray-700'}`}>Home</button>
          <button onClick={() => handleNav('plans')} className={`block w-full text-left py-2 ${currentView === 'plans' ? 'text-primary' : 'text-gray-700'}`}>Plans</button>
          <button onClick={() => handleNav('about')} className={`block w-full text-left py-2 ${currentView === 'about' ? 'text-primary' : 'text-gray-700'}`}>About PetCovered®</button>
          <button onClick={() => handleNav('claims')} className={`block w-full text-left py-2 ${currentView === 'claims' ? 'text-primary' : 'text-gray-700'}`}>How to Claim</button>
          <a href="#faq" className="block py-2 text-gray-700">FAQs</a>
          <button className="w-full bg-primary text-white px-6 py-3 rounded-xl shadow-lg">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

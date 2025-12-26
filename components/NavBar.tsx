import React, { useState } from 'react';
import { toggleBackgroundMusic, playButtonHover } from '../utils/soundUtils';

const NavBar: React.FC<{ onBack: () => void, showBack: boolean }> = ({ onBack, showBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMusicToggle = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    toggleBackgroundMusic(newState);
    playButtonHover();
  };

  return (
    <div className="w-full flex justify-between items-center p-4 md:p-6 fixed top-0 left-0 z-50 pointer-events-none">
      <div className="pointer-events-auto flex gap-4">
        {showBack && (
          <button 
            onClick={() => { onBack(); playButtonHover(); }}
            className="bg-white/80 backdrop-blur-md hover:bg-white text-orange-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 font-bold text-xl border-4 border-orange-200"
          >
            🏠
          </button>
        )}
      </div>
      
      <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-4 border-yellow-300 pointer-events-auto flex items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-yellow-600 hidden md:block">Aadhrith's World 🦁</h1>
        <button 
            onClick={handleMusicToggle}
            className={`rounded-full p-2 transition-colors ${isPlaying ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
            title="Toggle Music"
        >
            {isPlaying ? '🎵' : '🔇'}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
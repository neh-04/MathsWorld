import React from 'react';
import { playButtonHover } from '../utils/soundUtils';

interface MainMenuProps {
  onSelectMode: (mode: 'QUIZ' | 'TABLES') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4 pt-24 animate-in zoom-in-95 duration-500">
      
      <div className="text-center mb-12 relative">
         <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-8xl opacity-20 animate-pulse">🦁</div>
         <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 drop-shadow-sm tracking-tight" style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.1))' }}>
            Math World
         </h1>
         <p className="text-2xl text-gray-500 font-bold bg-white/50 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
            Hi Aadhrith! What do you want to do?
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        
        {/* Quiz Mode Card */}
        <button 
          onClick={() => { playButtonHover(); onSelectMode('QUIZ'); }}
          className="group relative bg-white border-b-8 border-blue-200 rounded-[3rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 transition-all duration-300 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-10 bg-blue-50 rounded-bl-[10rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10 flex flex-col items-center">
              <span className="text-8xl mb-6 group-hover:animate-bounce">🎮</span>
              <h2 className="text-4xl font-black text-blue-600 mb-2">Play Quiz</h2>
              <p className="text-gray-400 font-medium text-lg">Solve fun problems & win trophies!</p>
              <div className="mt-6 bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 Start Game ▶
              </div>
           </div>
        </button>

        {/* Tables Mode Card */}
        <button 
          onClick={() => { playButtonHover(); onSelectMode('TABLES'); }}
          className="group relative bg-white border-b-8 border-pink-200 rounded-[3rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-pink-400 transition-all duration-300 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-10 bg-pink-50 rounded-bl-[10rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10 flex flex-col items-center">
              <span className="text-8xl mb-6 group-hover:spin">🔢</span>
              <h2 className="text-4xl font-black text-pink-600 mb-2">Magic Tables</h2>
              <p className="text-gray-400 font-medium text-lg">Learn tables 2 to 10 with visuals!</p>
              <div className="mt-6 bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-bold group-hover:bg-pink-600 group-hover:text-white transition-colors">
                 Learn Now ▶
              </div>
           </div>
        </button>

      </div>
    </div>
  );
};

export default MainMenu;

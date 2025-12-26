import React, { useState } from 'react';
import NavBar from './components/NavBar';
import MainMenu from './components/MainMenu';
import MathOperationsGame from './components/MathOperationsGame';
import MathTables from './components/MathTables';

type AppView = 'MENU' | 'QUIZ' | 'TABLES';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('MENU');

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFDE7]"> {/* Lighter yellow bg */}
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <NavBar showBack={currentView !== 'MENU'} onBack={() => setCurrentView('MENU')} />
      
      {currentView === 'MENU' && (
        <MainMenu onSelectMode={(mode) => setCurrentView(mode)} />
      )}

      {currentView === 'QUIZ' && (
        <MathOperationsGame onExit={() => setCurrentView('MENU')} />
      )}

      {currentView === 'TABLES' && (
        <MathTables onBack={() => setCurrentView('MENU')} />
      )}

    </div>
  );
};

export default App;

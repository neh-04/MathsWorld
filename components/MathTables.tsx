import React, { useState, useEffect, useRef } from 'react';
import { playButtonHover, playCorrectSound, playWrongSound, playVictorySound } from '../utils/soundUtils';
import { speak } from '../utils/speechUtils';

interface MathTablesProps {
  onBack: () => void;
}

// Creative themes for each number to make it memorable
const TABLE_THEMES: Record<number, { emoji: string; name: string; color: string; bg: string }> = {
  2: { emoji: '🍒', name: 'Cherry Pairs', color: 'text-red-500', bg: 'bg-red-50' },
  3: { emoji: '🍦', name: 'Ice Creams', color: 'text-pink-500', bg: 'bg-pink-50' },
  4: { emoji: '🦁', name: 'Lion Paws', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  5: { emoji: '🖐️', name: 'High Fives', color: 'text-orange-500', bg: 'bg-orange-50' },
  6: { emoji: '🐞', name: 'Ladybugs', color: 'text-red-600', bg: 'bg-red-100' },
  7: { emoji: '🍭', name: 'Lollipops', color: 'text-purple-500', bg: 'bg-purple-50' },
  8: { emoji: '🐙', name: 'Octopus', color: 'text-blue-600', bg: 'bg-blue-50' },
  9: { emoji: '🎈', name: 'Balloons', color: 'text-green-500', bg: 'bg-green-50' },
  10: { emoji: '⭐', name: 'Stars', color: 'text-yellow-500', bg: 'bg-yellow-100' },
};

const MathTables: React.FC<MathTablesProps> = ({ onBack }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'LEARN' | 'PRACTICE'>('LEARN');
  
  // Practice Mode State
  const [practiceOptions, setPracticeOptions] = useState<number[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const autoPlayRef = useRef<number | null>(null);

  // Stop autoplay if we leave or change modes
  useEffect(() => {
    return () => stopAutoPlay();
  }, []);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    setIsAutoPlaying(false);
    window.speechSynthesis.cancel();
  };

  const handleSelectTable = (num: number) => {
    playButtonHover();
    setSelectedTable(num);
    setMultiplier(1);
    setViewMode('LEARN');
    speak(`Welcome to the ${TABLE_THEMES[num].name} table!`);
  };

  const handleNext = () => {
    if (multiplier < 10) {
      setMultiplier(m => m + 1);
      playButtonHover();
    } else {
        stopAutoPlay(); // Finished
    }
  };

  const handlePrev = () => {
    if (multiplier > 1) {
      setMultiplier(m => m - 1);
      playButtonHover();
    }
  };

  const speakCurrentEquation = () => {
    if (!selectedTable) return;
    const result = selectedTable * multiplier;
    // Natural language: "2 times 3 is 6"
    speak(`${selectedTable} times ${multiplier} is ${result}`);
  };

  // Trigger speech when multiplier changes in Learn mode
  useEffect(() => {
    if (viewMode === 'LEARN' && selectedTable) {
        // Small delay to allow UI to update
        const timer = setTimeout(() => {
            if (isAutoPlaying) {
                 speakCurrentEquation();
                 // Schedule next
                 if (multiplier < 10) {
                     autoPlayRef.current = window.setTimeout(() => {
                         setMultiplier(m => m + 1);
                     }, 3500); // Wait 3.5s before next
                 } else {
                     setIsAutoPlaying(false);
                 }
            } else {
                // Just speak once if not auto-playing
                // speakCurrentEquation(); 
                // Actually, maybe annoying if clicking fast. Let's make a manual "Speak" button or click header.
            }
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [multiplier, isAutoPlaying, viewMode, selectedTable]);

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        setIsAutoPlaying(true);
        setMultiplier(1); // Start from 1
        speak("Let's sing together!");
    }
  };

  // --- PRACTICE MODE LOGIC ---
  useEffect(() => {
      if (viewMode === 'PRACTICE' && selectedTable) {
          generatePracticeQuestion();
      }
  }, [viewMode, multiplier]);

  const generatePracticeQuestion = () => {
      if (!selectedTable) return;
      const answer = selectedTable * multiplier;
      // Generate 2 wrong answers
      let opts = new Set<number>();
      opts.add(answer);
      while(opts.size < 3) {
          const wrong = answer + Math.floor(Math.random() * 10) - 5;
          if (wrong > 0 && wrong !== answer) opts.add(wrong);
      }
      setPracticeOptions(Array.from(opts).sort(() => Math.random() - 0.5));
      setPracticeFeedback('none');
  };

  const handlePracticeOption = (opt: number) => {
      if (!selectedTable) return;
      const answer = selectedTable * multiplier;
      if (opt === answer) {
          playCorrectSound();
          setPracticeFeedback('correct');
          speak("That's right!");
          setTimeout(() => {
              if (multiplier < 10) {
                  setMultiplier(m => m + 1);
              } else {
                  playVictorySound();
                  speak("You finished the practice!");
                  setTimeout(() => setViewMode('LEARN'), 2000);
              }
          }, 1000);
      } else {
          playWrongSound();
          setPracticeFeedback('wrong');
          speak("Try again.");
      }
  };

  // --- SELECTION SCREEN ---
  if (!selectedTable) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4 pt-24 animate-in fade-in duration-500">
        <button onClick={onBack} className="self-start mb-6 bg-white px-6 py-2 rounded-full font-bold text-gray-500 hover:text-orange-500 shadow-sm border-2 border-gray-100 flex items-center gap-2">
            <span>◀</span> Back to Menu
        </button>
        
        <h2 className="text-4xl md:text-6xl font-black text-purple-600 mb-2 text-center drop-shadow-sm">
            Magic Tables 🎩
        </h2>
        <p className="text-xl text-gray-500 mb-10 font-medium">Pick a number to start the magic!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const theme = TABLE_THEMES[num];
                return (
                    <button
                        key={num}
                        onClick={() => handleSelectTable(num)}
                        className={`group ${theme.bg} border-b-8 border-white rounded-[2rem] p-4 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between aspect-[3/4]`}
                    >
                        <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform filter drop-shadow-md">{theme.emoji}</span>
                        <div className="text-center">
                            <span className={`block text-4xl font-black ${theme.color}`}>{num}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{theme.name}</span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>
    );
  }

  const theme = TABLE_THEMES[selectedTable];
  const result = selectedTable * multiplier;

  // --- LEARNING & PRACTICE SCREEN ---
  return (
    <div className={`flex flex-col items-center w-full min-h-screen ${theme.bg} transition-colors duration-500 pt-20 pb-10`}>
        
        {/* Header Bar */}
        <div className="w-full max-w-5xl px-4 flex justify-between items-center mb-6">
            <button onClick={() => { stopAutoPlay(); setSelectedTable(null); }} className="bg-white/80 backdrop-blur px-4 py-2 rounded-full font-bold text-gray-600 hover:scale-105 shadow-sm">
                ◀ Pick Number
            </button>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => { stopAutoPlay(); setViewMode('LEARN'); }}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'LEARN' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-white/50 text-gray-500'}`}
                >
                    👀 Learn
                </button>
                <button 
                    onClick={() => { stopAutoPlay(); setViewMode('PRACTICE'); setMultiplier(1); }}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'PRACTICE' ? 'bg-green-500 text-white shadow-lg scale-105' : 'bg-white/50 text-gray-500'}`}
                >
                    🎮 Practice
                </button>
            </div>
        </div>

        {/* Main Stage */}
        <div className="w-full max-w-4xl px-4 flex flex-col items-center">
            
            {/* The Equation */}
            <div className="bg-white rounded-3xl shadow-xl px-8 py-6 mb-8 flex items-center justify-center gap-4 md:gap-8 transform hover:scale-105 transition-transform cursor-pointer" onClick={speakCurrentEquation}>
                <span className={`text-6xl md:text-8xl font-black ${theme.color}`}>{selectedTable}</span>
                <span className="text-4xl md:text-6xl text-gray-300 font-bold">×</span>
                <span className="text-6xl md:text-8xl font-black text-gray-700">{multiplier}</span>
                <span className="text-4xl md:text-6xl text-gray-300 font-bold">=</span>
                {viewMode === 'LEARN' ? (
                     <span className={`text-7xl md:text-9xl font-black ${theme.color} animate-in zoom-in spin-in-3 duration-500`}>{result}</span>
                ) : (
                    <span className="text-6xl md:text-8xl font-black text-gray-200">?</span>
                )}
            </div>

            {/* Navigation / Controls */}
            {viewMode === 'LEARN' && (
                <div className="flex items-center gap-6 mb-8 w-full justify-center">
                    <button onClick={handlePrev} disabled={multiplier === 1} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                        ⬅️
                    </button>
                    
                    <button 
                        onClick={toggleAutoPlay}
                        className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 transition-all ${isAutoPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {isAutoPlaying ? '⏸ Pause' : '▶ Auto Play'}
                    </button>

                    <button onClick={handleNext} disabled={multiplier === 10} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                        ➡️
                    </button>
                </div>
            )}

            {/* Visuals Area (Groups) */}
            <div className="w-full bg-white/60 backdrop-blur-sm rounded-[3rem] p-6 md:p-10 min-h-[300px] shadow-inner border-4 border-white">
                
                {/* Practice Options */}
                {viewMode === 'PRACTICE' && (
                    <div className="flex justify-center gap-6 mb-8">
                        {practiceOptions.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handlePracticeOption(opt)}
                                className={`text-4xl md:text-5xl font-bold py-6 px-8 rounded-2xl shadow-lg border-b-4 transition-all active:scale-95
                                    ${practiceFeedback === 'correct' && opt === result 
                                        ? 'bg-green-500 text-white border-green-700 scale-110' 
                                        : practiceFeedback === 'wrong' && opt !== result
                                            ? 'bg-gray-200 text-gray-400 border-gray-300'
                                            : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                    }
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <h3 className="text-center text-gray-400 font-bold mb-6 text-xl uppercase tracking-widest">
                    {multiplier} Groups of {selectedTable}
                </h3>
                
                <div className="flex flex-wrap justify-center gap-6">
                    {Array.from({ length: multiplier }).map((_, groupIdx) => (
                        <div 
                            key={groupIdx} 
                            className={`relative bg-white p-2 rounded-2xl shadow-md border-2 border-dashed flex flex-wrap content-center justify-center gap-1 w-[100px] h-[100px] md:w-[120px] md:h-[120px] animate-in zoom-in duration-300`}
                            style={{ animationDelay: `${groupIdx * 0.1}s`, borderColor: 'rgba(0,0,0,0.1)' }}
                        >
                             {/* Group Label */}
                             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 rounded-full">
                                {groupIdx + 1}
                             </div>
                             
                             {/* Items inside group */}
                             <div className="flex flex-wrap justify-center items-center gap-1">
                                {Array.from({ length: selectedTable }).map((_, itemIdx) => (
                                    <span key={itemIdx} className="text-2xl md:text-3xl leading-none filter drop-shadow-sm">
                                        {theme.emoji}
                                    </span>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};

export default MathTables;
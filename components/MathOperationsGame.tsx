import React, { useState, useEffect } from 'react';
import { generateLocalMathProblem } from '../services/mathService';
import { MathProblem, MathOperation, Difficulty } from '../types';
import { playCorrectSound, playWrongSound, playButtonHover, playVictorySound } from '../utils/soundUtils';
import { speak } from '../utils/speechUtils';

interface MathGameProps {
    onExit: () => void;
}

type GameState = 'SELECT_OP' | 'SELECT_DIFF' | 'PLAYING' | 'RESULT';

const TOTAL_QUESTIONS = 5;

const MathOperationsGame: React.FC<MathGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('SELECT_OP');
  
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  
  // Game Session State
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<MathOperation | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [prevHighScore, setPrevHighScore] = useState(0);

  // Persistent State
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('aadhrith_math_highscore');
    if (stored) {
      setHighScore(parseInt(stored));
    }
  }, []);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setQuestionIndex(0);
    setIsNewHighScore(false);
    setPrevHighScore(highScore);
    setGameState('PLAYING');
    
    // Load first problem
    if (selectedOperation) {
      loadNewProblem(selectedOperation, diff);
    }
  };

  const loadNewProblem = (op: MathOperation, diff: Difficulty) => {
    setFeedback('none');
    const newProblem = generateLocalMathProblem(op, diff);
    setProblem(newProblem);
    speak(newProblem.question);
  };

  const handleSelectOperation = (op: MathOperation) => {
    playButtonHover();
    setSelectedOperation(op);
    speak(op.toLowerCase().replace('_', ' ') + " selected");
    setGameState('SELECT_DIFF');
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    playButtonHover();
    startGame(diff);
  };

  const handleOptionClick = (option: number) => {
    if (!problem || !selectedOperation || !difficulty || feedback !== 'none') return;

    if (option === problem.answer) {
      playCorrectSound();
      setFeedback('correct');
      const points = 10;
      setScore(s => s + points);
      speak("Correct!");
      
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      playWrongSound();
      setFeedback('wrong');
      speak("Oops! Try again.");
      setTimeout(() => {
        setFeedback('none');
      }, 1000);
    }
  };

  const nextQuestion = () => {
    const nextIdx = questionIndex + 1;
    if (nextIdx >= TOTAL_QUESTIONS) {
      finishGame();
    } else {
      setQuestionIndex(nextIdx);
      if (selectedOperation && difficulty) {
        loadNewProblem(selectedOperation, difficulty);
      }
    }
  };

  const finishGame = () => {
    setGameState('RESULT');
    playVictorySound();
  };
  
  useEffect(() => {
    if (gameState === 'RESULT') {
        if (score > highScore) {
            setIsNewHighScore(true);
            setHighScore(score);
            localStorage.setItem('aadhrith_math_highscore', score.toString());
            speak(`Wow! New High Score! ${score} points!`);
        } else {
            speak(`Great job! You got ${score} points.`);
        }
    }
  }, [gameState, score, highScore]);

  const resetGame = () => {
    playButtonHover();
    setGameState('SELECT_OP');
    setProblem(null);
    setSelectedOperation(null);
    setDifficulty(null);
  };

  const playAgain = () => {
    playButtonHover();
    if (difficulty) {
        startGame(difficulty);
    }
  };

  // --- RENDERERS ---

  if (gameState === 'SELECT_OP') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4 pt-20 animate-in fade-in duration-500">
        
        <button onClick={onExit} className="self-start ml-4 mb-4 bg-white px-4 py-2 rounded-full font-bold text-gray-500 hover:text-orange-500 shadow-sm border-2 border-gray-100 flex items-center gap-2">
            <span>🏠</span> Home
        </button>

        {highScore > 0 && (
            <div className="absolute top-20 right-4 md:right-10 bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm animate-pulse">
                🏆 High Score: {highScore}
            </div>
        )}

        <h2 className="text-4xl md:text-6xl font-black text-purple-600 mb-2 text-center tracking-tight" style={{textShadow: '2px 2px 0px #fff'}}>
            Quiz Time! 🚀
        </h2>
        <p className="text-gray-500 mb-8 text-xl font-medium">Pick a game to start</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full px-4">
            <OperationCard 
              op={MathOperation.ADDITION} 
              icon="➕" 
              title="Add" 
              color="green" 
              onClick={() => handleSelectOperation(MathOperation.ADDITION)} 
            />
            <OperationCard 
              op={MathOperation.SUBTRACTION} 
              icon="➖" 
              title="Subtract" 
              color="red" 
              onClick={() => handleSelectOperation(MathOperation.SUBTRACTION)} 
            />
            <OperationCard 
              op={MathOperation.MULTIPLICATION} 
              icon="✖️" 
              title="Multiply" 
              color="blue" 
              onClick={() => handleSelectOperation(MathOperation.MULTIPLICATION)} 
            />
            <OperationCard 
              op={MathOperation.DIVISION} 
              icon="➗" 
              title="Divide" 
              color="orange" 
              onClick={() => handleSelectOperation(MathOperation.DIVISION)} 
            />
            <button 
              onClick={() => handleSelectOperation(MathOperation.MIXED)} 
              className="col-span-2 md:col-span-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white border-b-8 border-purple-600 p-6 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all group flex flex-row items-center justify-center gap-4"
            >
                <span className="text-4xl md:text-5xl group-hover:spin">🎲</span>
                <span className="text-2xl md:text-3xl font-bold">Mix It Up!</span>
            </button>
        </div>
      </div>
    );
  }

  if (gameState === 'SELECT_DIFF') {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 pt-20 animate-in slide-in-from-right-10 duration-300">
            <button onClick={() => setGameState('SELECT_OP')} className="self-start mb-6 bg-white px-4 py-2 rounded-full font-bold text-gray-500 hover:text-orange-500 shadow-sm border-2 border-gray-100">
                ◀ Back
            </button>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8 text-center">Choose Level 🏆</h2>
            <div className="grid grid-cols-1 gap-4 w-full px-4">
                <DifficultyCard 
                  diff={Difficulty.EASY} 
                  icon="👶" 
                  title="Starter" 
                  desc="Numbers 1-5" 
                  color="yellow" 
                  onClick={() => handleSelectDifficulty(Difficulty.EASY)}
                />
                <DifficultyCard 
                  diff={Difficulty.MEDIUM} 
                  icon="🚀" 
                  title="Learner" 
                  desc="Numbers 1-10" 
                  color="blue" 
                  onClick={() => handleSelectDifficulty(Difficulty.MEDIUM)}
                />
                <DifficultyCard 
                  diff={Difficulty.HARD} 
                  icon="👑" 
                  title="Master" 
                  desc="Numbers 1-20" 
                  color="red" 
                  onClick={() => handleSelectDifficulty(Difficulty.HARD)}
                />
            </div>
        </div>
    );
  }

  if (gameState === 'RESULT') {
      return (
        <div className="flex flex-col items-center justify-center w-full min-h-[80vh] p-4 animate-in zoom-in-90 duration-500 relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 text-4xl animate-bounce">✨</div>
                <div className="absolute top-20 right-20 text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
                <div className="absolute bottom-10 left-1/3 text-4xl animate-bounce" style={{animationDelay: '1s'}}>🎉</div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl text-center border-b-8 border-yellow-300 max-w-lg w-full relative z-10">
                
                {isNewHighScore && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-black text-xl shadow-lg animate-pulse whitespace-nowrap border-4 border-white">
                        NEW HIGH SCORE! 🚀
                    </div>
                )}

                <div className="text-[8rem] mb-4 drop-shadow-lg filter">🏆</div>
                
                <h2 className="text-4xl font-black text-gray-800 mb-2">You Won!</h2>
                
                <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                    <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-1">Your Score</div>
                    <div className="text-6xl font-black text-blue-600">{score}</div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={playAgain}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
                    >
                        Play Again 🔄
                    </button>
                    <button 
                        onClick={resetGame}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-4 rounded-xl text-xl transition-colors"
                    >
                        Menu 🏠
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- PLAYING STATE ---
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20">
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-6 px-2 md:px-0">
        <button onClick={resetGame} className="bg-white px-4 py-2 rounded-full shadow-md text-gray-500 font-bold hover:text-red-500 border-2 border-transparent hover:border-red-100 transition-all text-sm md:text-base">
            ❌ Quit
        </button>
        
        {/* Progress Dots */}
        <div className="flex gap-2">
            {[...Array(TOTAL_QUESTIONS)].map((_, i) => (
                <div key={i} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${i < questionIndex ? 'bg-green-500' : i === questionIndex ? 'bg-blue-500 scale-125' : 'bg-gray-200'}`} />
            ))}
        </div>

        <div className="bg-yellow-400 text-white font-black py-2 px-4 md:px-6 rounded-full shadow-[0_4px_0_rgb(202,138,4)] text-lg md:text-2xl border-2 border-yellow-200 min-w-[80px] text-center">
            {score}
        </div>
      </div>

      {problem && (
        <div className="w-full animate-in zoom-in-95 duration-300">
          
          <div className="bg-white rounded-[2rem] p-4 md:p-10 shadow-2xl w-full text-center border-b-8 border-purple-200 relative overflow-hidden">
            
            <button 
                onClick={() => speak(problem.question)}
                className="absolute top-4 right-4 bg-purple-100 p-2 md:p-3 rounded-full hover:bg-purple-200 transition-colors z-10"
                title="Read Question"
            >
                🔊
            </button>

            {/* Visuals Container */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 mb-6 md:mb-8 bg-purple-50 rounded-2xl p-4 md:p-6 min-h-[160px] md:min-h-[200px] border-4 border-purple-100 border-dashed">
                
                {/* Visuals Logic */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-[120px] md:max-w-[160px]">
                        {problem.items.map((item, i) => (
                            <span key={i} className="text-4xl md:text-6xl animate-bounce-slight" style={{animationDelay: `${i*0.05}s`}}>{item}</span>
                        ))}
                    </div>
                </div>

                <div className="text-4xl md:text-6xl font-black text-purple-400 mx-2 drop-shadow-sm">
                    {problem.operationSymbol}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-[120px] md:max-w-[160px]">
                        {problem.secondItems?.map((item, i) => (
                            <span key={i} className="text-4xl md:text-6xl animate-bounce-slight" style={{animationDelay: `${i*0.05}s`}}>{item}</span>
                        ))}
                    </div>
                </div>

                <div className="text-4xl md:text-6xl font-black text-purple-400 mx-2">=</div>

                {/* Answer Box */}
                <div className={`w-20 h-20 md:w-32 md:h-32 border-4 border-dashed rounded-2xl flex items-center justify-center bg-white transition-all duration-300
                    ${feedback === 'correct' ? 'border-green-400 bg-green-100 scale-110' : 'border-purple-300'}
                `}>
                    <span className={`text-3xl md:text-5xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-purple-200'}`}>
                        {feedback === 'correct' ? problem.answer : '?'}
                    </span>
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">{problem.question}</h2>
            <p className="text-purple-400 font-medium mb-6 md:mb-8 text-base md:text-lg">{problem.hint}</p>

            {/* Options Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-8">
                {problem.options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={playButtonHover}
                    className={`
                        relative overflow-hidden group
                        text-4xl md:text-7xl font-bold py-4 md:py-8 rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.1)] md:shadow-[0_6px_0_rgb(0,0,0,0.1)]
                        transform transition-all active:translate-y-1 active:shadow-none
                        ${feedback === 'correct' && option === problem.answer 
                            ? 'bg-green-400 text-white shadow-[0_4px_0_rgb(22,163,74)] md:shadow-[0_6px_0_rgb(22,163,74)]' 
                            : feedback === 'wrong' && option !== problem.answer 
                                ? 'opacity-30 bg-gray-200 cursor-not-allowed' 
                                : 'bg-white text-blue-500 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(59,130,246,0.2)] md:hover:shadow-[0_8px_0_rgb(59,130,246,0.2)] border-2 border-blue-100'
                        }
                    `}
                >
                    <span className="relative z-10">{option}</span>
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                ))}
            </div>
            
          </div>
        </div>
      )}

      {/* Full screen celebration overlay for single question correct */}
      {feedback === 'correct' && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            <div className="text-8xl md:text-9xl animate-bounce drop-shadow-2xl">🎉</div>
        </div>
      )}

    </div>
  );
};

// Helper Components

const OperationCard: React.FC<{op: MathOperation, icon: string, title: string, color: string, onClick: () => void}> = ({op, icon, title, color, onClick}) => {
    const colorClasses: Record<string, string> = {
        green: 'bg-green-50 border-green-200 text-green-600',
        red: 'bg-red-50 border-red-200 text-red-600',
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        orange: 'bg-orange-50 border-orange-200 text-orange-600',
    };

    return (
        <button 
            onClick={onClick} 
            className={`${colorClasses[color]} border-b-8 p-4 md:p-6 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all group flex flex-col items-center justify-center h-40 md:h-48`}
        >
            <span className="text-4xl md:text-6xl mb-2 md:mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</span>
            <span className="text-lg md:text-2xl font-bold">{title}</span>
        </button>
    );
};

const DifficultyCard: React.FC<{diff: Difficulty, icon: string, title: string, desc: string, color: string, onClick: () => void}> = ({icon, title, desc, color, onClick}) => {
    const borderColors: Record<string, string> = {
        yellow: 'border-yellow-400 hover:bg-yellow-50',
        blue: 'border-blue-400 hover:bg-blue-50',
        red: 'border-red-400 hover:bg-red-50',
    };
    
    return (
        <button onClick={onClick} className={`bg-white border-4 ${borderColors[color]} p-4 md:p-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center gap-4 md:gap-6 group min-h-[100px]`}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl md:text-4xl group-hover:rotate-12 transition-transform shrink-0">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-black">{title}</h3>
                <p className="text-gray-400 font-medium text-sm md:text-base">{desc}</p>
            </div>
            <div className="ml-auto text-2xl md:text-3xl text-gray-300 group-hover:text-gray-500">▶</div>
        </button>
    );
}

export default MathOperationsGame;

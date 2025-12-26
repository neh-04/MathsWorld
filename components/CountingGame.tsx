import React, { useEffect, useState } from 'react';
import { generateMathProblem } from '../services/geminiService';
import { MathProblem, Difficulty, MathOperation } from '../types';
import { playCorrectSound, playWrongSound } from '../utils/soundUtils';

const CountingGame: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [score, setScore] = useState(0);

  const loadNewProblem = async () => {
    setLoading(true);
    setFeedback('none');
    // For counting game, we default to Counting/Easy style behavior by just asking for items
    const newProblem = await generateMathProblem(MathOperation.ADDITION, Difficulty.EASY); 
    // Override question to ensure it's just counting for this specific game mode if needed, 
    // but the generic service handles it reasonably well. 
    // Let's manually simplify if needed, or trust the prompt 'easy' logic.
    // Actually, let's just use the generic easy add/count logic.
    setProblem(newProblem);
    setLoading(false);
  };

  useEffect(() => {
    loadNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = (option: number) => {
    if (!problem) return;

    if (option === problem.correctAnswer) {
      playCorrectSound();
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(loadNewProblem, 1500);
    } else {
      playWrongSound();
      setFeedback('wrong');
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-pulse">
        <div className="text-8xl mb-4">🐘</div>
        <h2 className="text-3xl font-bold text-purple-600">Loading Fun...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 pt-20">
      
      {/* Score */}
      <div className="absolute top-24 right-6 bg-yellow-400 text-white font-bold py-2 px-6 rounded-full shadow-lg border-4 border-white text-xl">
        ⭐ {score}
      </div>

      {problem && (
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full text-center border-b-8 border-purple-200">
          <h2 className="text-4xl font-bold text-purple-600 mb-8">{problem.question}</h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12 min-h-[150px] items-center">
            {problem.items.map((item, idx) => (
              <div 
                key={idx} 
                className="text-8xl transform hover:scale-125 transition-transform cursor-pointer animate-bounce"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {item}
              </div>
            ))}
             {problem.secondItems && problem.secondItems.map((item, idx) => (
              <div 
                key={`sec-${idx}`} 
                className="text-8xl transform hover:scale-125 transition-transform cursor-pointer animate-bounce"
                style={{ animationDelay: `${(idx + problem.items.length) * 0.1}s` }}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {problem.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`text-6xl font-bold py-8 rounded-2xl shadow-lg transform transition-all hover:-translate-y-2 active:translate-y-0
                  ${feedback === 'correct' && option === problem.correctAnswer ? 'bg-green-400 text-white scale-110' : ''}
                  ${feedback === 'wrong' && option !== problem.correctAnswer ? 'opacity-50 bg-gray-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <div className="mt-8 text-4xl font-bold text-green-500 animate-bounce">
              🎉 Awesome!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountingGame;
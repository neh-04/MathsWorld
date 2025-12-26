import React, { useState } from 'react';
import { ShapeType } from '../types';
import { playCorrectSound, playWrongSound } from '../utils/soundUtils';

const ShapeGame: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.CIRCLE);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const shapes = [
    { type: ShapeType.CIRCLE, color: 'bg-red-400', label: 'Circle' },
    { type: ShapeType.SQUARE, color: 'bg-blue-400', label: 'Square' },
    { type: ShapeType.TRIANGLE, color: 'bg-green-400', label: 'Triangle' },
  ];

  const handleShapeClick = (selected: ShapeType) => {
    if (selected === currentShape) {
      playCorrectSound();
      setFeedback('correct');
      setTimeout(() => {
        const next = [ShapeType.CIRCLE, ShapeType.SQUARE, ShapeType.TRIANGLE][Math.floor(Math.random() * 3)];
        setCurrentShape(next);
        setFeedback('none');
      }, 1500);
    } else {
      playWrongSound();
      setFeedback('wrong');
    }
  };

  const renderShape = (type: ShapeType, className: string) => {
    if (type === ShapeType.CIRCLE) return <div className={`w-32 h-32 rounded-full ${className}`}></div>;
    if (type === ShapeType.SQUARE) return <div className={`w-32 h-32 rounded-lg ${className}`}></div>;
    if (type === ShapeType.TRIANGLE) return (
      <div className={`w-0 h-0 border-l-[64px] border-l-transparent border-t-[0px] border-r-[64px] border-r-transparent border-b-[128px] ${className.replace('bg-', 'border-b-')}`}></div>
    );
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 pt-20">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full text-center border-b-8 border-pink-200">
        <h2 className="text-3xl font-bold text-pink-600 mb-8">
          Find the {currentShape}!
        </h2>

        <div className="flex justify-center gap-8 items-end h-48">
          {shapes.map((s) => (
            <div
              key={s.type}
              onClick={() => handleShapeClick(s.type)}
              className="cursor-pointer transform hover:scale-110 transition-transform flex flex-col items-center gap-4"
            >
              {renderShape(s.type, s.color)}
              <span className="text-xl font-bold text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>

        {feedback === 'correct' && (
           <div className="mt-12 text-6xl animate-spin">🌟</div>
        )}
      </div>
    </div>
  );
};

export default ShapeGame;
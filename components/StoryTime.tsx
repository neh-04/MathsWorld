import React, { useState } from 'react';
import { generateStory } from '../services/geminiService';

const StoryTime: React.FC = () => {
  const [story, setStory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    setLoading(true);
    const text = await generateStory();
    setStory(text);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 pt-20">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full text-center border-b-8 border-teal-200 min-h-[400px] flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-teal-600 mb-4">Aadhrith's Jungle Adventure</h2>
        
        <div className="flex-grow flex items-center justify-center p-6 bg-teal-50 rounded-2xl mb-6">
          {loading ? (
             <div className="text-xl text-teal-800 animate-pulse">Writing a story for you... 🖊️</div>
          ) : story ? (
             <p className="text-2xl leading-relaxed text-teal-900 font-medium">
                {story}
             </p>
          ) : (
            <div className="text-center opacity-50">
                <div className="text-6xl mb-2">🦁</div>
                <p>Press the button to read a story!</p>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerateStory}
          disabled={loading}
          className={`w-full py-4 rounded-xl text-2xl font-bold text-white shadow-lg transition-all
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 hover:-translate-y-1'}
          `}
        >
          {loading ? 'Thinking...' : 'Tell me a Story!'}
        </button>
      </div>
    </div>
  );
};

export default StoryTime;
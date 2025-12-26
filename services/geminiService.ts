import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem, MathOperation, Difficulty } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMathProblem = async (
  operationType: MathOperation, 
  difficulty: Difficulty
): Promise<MathProblem> => {
  if (!apiKey) {
    // Fallback if no API key
    return {
      question: "2 + 1 = ?",
      items: ["🍎", "🍎"],
      secondItems: ["🍎"],
      operationSymbol: "+",
      answer: 3,
      options: [2, 3, 5],
      hint: "Count them all together!"
    };
  }

  try {
    let rangeDesc = "numbers 1 to 5";
    if (difficulty === Difficulty.MEDIUM) rangeDesc = "numbers 1 to 10";
    if (difficulty === Difficulty.HARD) rangeDesc = "numbers 1 to 20";

    let promptTopic = "";
    
    // Logic for Mixed Mode: Randomly pick an operation suitable for the level
    let effectiveOp = operationType;
    if (operationType === MathOperation.MIXED) {
      const ops = [MathOperation.ADDITION, MathOperation.SUBTRACTION];
      if (difficulty !== Difficulty.EASY) {
        ops.push(MathOperation.MULTIPLICATION);
      }
      if (difficulty === Difficulty.HARD) {
        ops.push(MathOperation.DIVISION);
      }
      effectiveOp = ops[Math.floor(Math.random() * ops.length)];
    }

    switch (effectiveOp) {
      case MathOperation.ADDITION:
        promptTopic = `Addition using ${rangeDesc}. deeply visual, easy to count.`;
        break;
      case MathOperation.SUBTRACTION:
        promptTopic = `Subtraction using ${rangeDesc}. Result must be positive. Visuals should show taking away.`;
        break;
      case MathOperation.MULTIPLICATION:
        promptTopic = `Simple multiplication (repeated addition) using ${rangeDesc}. E.g., 2 groups of 3.`;
        break;
      case MathOperation.DIVISION:
        promptTopic = `Simple division (fair sharing) using ${rangeDesc}. Evenly divisible numbers only.`;
        break;
      default:
        promptTopic = "Counting items up to 10.";
    }

    const prompt = `Generate a math problem for a child (Difficulty: ${difficulty}). 
    Topic: ${promptTopic}.
    Return strictly JSON.
    'items' array: emojis for the first number.
    'secondItems' array: emojis for the second number.
    'operation' string: symbol (+, -, x, /).
    'question': The math question (e.g. "2 + 3 = ?").
    'options': 3 distinct numeric choices.
    'correctAnswer': the correct number.
    'hint': A helpful pedagogical hint.
    Items should be: animals, fruits, or stars.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            secondItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            operation: { type: Type.STRING },
            count: { type: Type.NUMBER },
            options: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            correctAnswer: { type: Type.NUMBER },
            hint: { type: Type.STRING }
          },
          required: ["question", "items", "options", "correctAnswer"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    
    // Ensure data integrity
    if (!data.secondItems) data.secondItems = [];
    
    return {
      question: data.question || "Count?",
      items: data.items || [],
      secondItems: data.secondItems,
      operationSymbol: data.operation || "+",
      answer: data.correctAnswer || 0,
      options: data.options || [0, 1, 2],
      hint: data.hint || "Try counting!"
    };

  } catch (error) {
    console.error("Error generating math problem:", error);
    return {
      question: "Count the stars!",
      items: ["⭐", "⭐"],
      secondItems: [],
      operationSymbol: "+",
      answer: 2,
      options: [1, 2, 3],
      hint: "Twinkle twinkle!"
    };
  }
};

export const generateStory = async (): Promise<string> => {
  if (!apiKey) return "Please add your API Key to read a story!";

  try {
    const prompt = "Tell a very short, interactive 3-sentence story about a boy named Aadhrith finding magic numbers in the jungle. Keep it exciting and simple for a nursery child.";
    
    const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });
    
    return textResponse.text || "Once upon a time...";
  } catch (e) {
    console.error(e);
    return "Aadhrith went on an adventure!";
  }
}
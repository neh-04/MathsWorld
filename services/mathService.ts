import { MathProblem, MathOperation, Difficulty } from "../types";

const EMOJIS = ['🍎', '🍌', '🍇', '🐶', '🐱', '🦁', '🐸', '⭐', '🎈', '🚗', '🍪', '🦖'];

const getRandomEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

const generateNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateOptions = (correct: number, min: number, max: number): number[] => {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < 3) {
    let wrong = generateNumber(Math.max(0, correct - 5), correct + 5);
    if (wrong !== correct && wrong >= 0) {
      options.add(wrong);
    }
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateLocalMathProblem = (op: MathOperation, diff: Difficulty): MathProblem => {
  let min = 1;
  let max = 5;
  
  if (diff === Difficulty.MEDIUM) max = 10;
  if (diff === Difficulty.HARD) max = 20;

  let operation = op;
  if (op === MathOperation.MIXED) {
    const ops = [MathOperation.ADDITION, MathOperation.SUBTRACTION];
    if (diff !== Difficulty.EASY) ops.push(MathOperation.MULTIPLICATION);
    // Simple division only for hard/mixed to avoid confusion
    if (diff === Difficulty.HARD) ops.push(MathOperation.DIVISION); 
    operation = ops[Math.floor(Math.random() * ops.length)];
  }

  let num1 = 0, num2 = 0, answer = 0, symbol = '+';
  const emoji = getRandomEmoji();
  
  switch (operation) {
    case MathOperation.ADDITION:
      num1 = generateNumber(min, max);
      num2 = generateNumber(min, max);
      answer = num1 + num2;
      symbol = '+';
      break;
    case MathOperation.SUBTRACTION:
      num1 = generateNumber(min, max);
      num2 = generateNumber(1, num1); // Ensure positive result
      answer = num1 - num2;
      symbol = '-';
      break;
    case MathOperation.MULTIPLICATION:
      num1 = generateNumber(1, diff === Difficulty.EASY ? 3 : 5); // Smaller numbers for visual grouping
      num2 = generateNumber(1, diff === Difficulty.EASY ? 3 : 5);
      answer = num1 * num2;
      symbol = '×';
      break;
    case MathOperation.DIVISION:
      num2 = generateNumber(1, 5); // Divisor
      answer = generateNumber(1, 4); // Quotient
      num1 = num2 * answer; // Dividend
      symbol = '÷';
      break;
  }

  // Generate visual items
  // For Mult: num1 groups of num2 items? Or just total items?
  // Let's keep it simple: Just show total items for Add/Sub.
  // For Mult/Div, we might show groups.
  
  let items: string[] = [];
  let secondItems: string[] = [];

  if (operation === MathOperation.MULTIPLICATION) {
    // Show 'num1' groups of 'num2' items is tricky in flat array, 
    // but let's just show num1 items and num2 items visually separated in component
    items = Array(num1).fill(emoji);
    secondItems = Array(num2).fill(emoji); 
  } else if (operation === MathOperation.DIVISION) {
     items = Array(num1).fill(emoji);
     secondItems = Array(num2).fill('🧺'); // Baskets/Groups
  } else {
    items = Array(num1).fill(emoji);
    secondItems = Array(num2).fill(emoji);
  }

  return {
    question: getQuestionText(operation, num1, num2),
    items,
    secondItems,
    operationSymbol: symbol,
    answer,
    options: generateOptions(answer, 0, max * 2),
    hint: getHintText(operation)
  };
};

const getQuestionText = (op: MathOperation, n1: number, n2: number) => {
  switch(op) {
    case MathOperation.ADDITION: return `What is ${n1} plus ${n2}?`;
    case MathOperation.SUBTRACTION: return `What is ${n1} take away ${n2}?`;
    case MathOperation.MULTIPLICATION: return `What is ${n1} times ${n2}?`;
    case MathOperation.DIVISION: return `What is ${n1} divided by ${n2}?`;
    default: return "";
  }
}

const getHintText = (op: MathOperation) => {
    switch(op) {
      case MathOperation.ADDITION: return "Count all of them together!";
      case MathOperation.SUBTRACTION: return "Cross out the ones we take away.";
      case MathOperation.MULTIPLICATION: return "Add the groups together.";
      case MathOperation.DIVISION: return "Share them equally.";
      default: return "";
    }
}

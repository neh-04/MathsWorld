export enum GameType {
  MATH_FUN = 'MATH_FUN'
}

export enum MathOperation {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  MIXED = 'MIXED'
}

export enum Difficulty {
  EASY = 'EASY',     // Numbers 1-5, highly visual
  MEDIUM = 'MEDIUM', // Numbers 1-10
  HARD = 'HARD'      // Numbers 1-20, fewer visuals
}

export enum ShapeType {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  TRIANGLE = 'TRIANGLE'
}

export interface MathProblem {
  question: string;
  items: string[]; 
  secondItems?: string[]; 
  operationSymbol: string; 
  answer: number;
  options: number[];
  hint: string;
}
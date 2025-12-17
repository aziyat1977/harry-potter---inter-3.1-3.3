export enum SlideType {
  TITLE = 'TITLE',
  AGENDA = 'AGENDA',
  STORY = 'STORY',
  THEORY = 'THEORY',
  QUIZ = 'QUIZ',
  GAP_FILL = 'GAP_FILL',
  KEY = 'KEY',
  END = 'END'
}

export interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
}

export interface SlideData {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string | string[]; // For stories or bullet points
  questions?: Question[];
  imagePrompt?: string; // Description for a placeholder image
  context?: string; // For story context
  speaker?: string; // For title slide presenter
  visual?: string; // Description of visual
  gapFillExercises?: GapFillExercise[];
}

export interface GapFillExercise {
  title: string;
  sentences: {
    id: number;
    textBefore: string;
    answer: string;
    textAfter: string;
    options?: string[]; // For dropdowns
  }[];
}

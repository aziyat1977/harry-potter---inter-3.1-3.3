export enum SlideType {
  TITLE = 'TITLE',
  MFP = 'MFP',
  QUIZ_SINGLE = 'QUIZ_SINGLE',
  END = 'END'
}

export interface MFPData {
  meaning: {
    eng: string;
    rus: string;
    uzb: string;
  };
  form: {
    formula: string;
    notes: string;
  };
  pronunciation: {
    word: string;
    ipa: string;
  };
  examples: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SlideData {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string; 
  mfp?: MFPData;
  quizQuestion?: QuizQuestion;
  visualId?: string; 
}

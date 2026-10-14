export interface VocabularyItem {
  id: string;
  unit: number;
  unitTitle: string;
  term: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase';
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  topic: string;
  iconEmoji: string;
}

export type QuizType = 
  | 'missing-letter' 
  | 'unscramble' 
  | 'listen-choose' 
  | 'en-vi' 
  | 'vi-en';

export interface PhonicsRule {
  id: string;
  endingOrType: string;
  soundIpa: string;
  memoryTrick: string; // Mẹo nhớ vui
  examples: Array<{ word: string; phonetic: string; meaningVi: string }>;
}

export interface PhonicsLesson {
  id: 's-es' | 'ed' | 'word-stress' | 'sentence-stress';
  title: string;
  subtitle: string;
  description: string;
  rules: PhonicsRule[];
  practiceQuiz: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    audioWord?: string;
  }>;
}

export interface UserProgress {
  totalStars: number;
  learnedWordIds: string[];
  favoriteWordIds: string[];
  unitScores: Record<number, number>; // unit number -> highest quiz score %
  phonicsCompleted: string[]; // lesson ids
  streakDays: number;
  lastStudyDate: string;
}

export interface VocabularyCard {
  id: string;
  word: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  definition: string;
  examples: string[];
  phonetic?: string;
  partOfSpeech: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  frequency: number; // Oxford frequency ranking
  learned: boolean;
  confused: boolean;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  incorrectCount: number;
  tags: string[];
  notes?: string;
}

export interface VocabularyProgress {
  totalWords: number;
  learnedWords: number;
  reviewWords: number;
  newWords: number;
  dailyGoal: number;
  currentStreak: number;
  maxStreak: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

export interface StudySession {
  id: string;
  date: Date;
  wordsStudied: string[];
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number; // in minutes
  sessionType: "new" | "review" | "mixed";
}

export interface VocabularySettings {
  dailyNewWords: number;
  dailyReviewWords: number;
  maxCardsPerSession: number;
  enableSpacedRepetition: boolean;
  showPhonetics: boolean;
  autoPlayPronunciation: boolean;
  cardStyle: "minimal" | "detailed" | "visual";
}

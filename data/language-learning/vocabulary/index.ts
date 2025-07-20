// Main vocabulary system exports
export * from "./types";
export * from "./vocabularyManager";
export * from "./studyMethods";

// Oxford-3000 Word data exports
export { a1Words, a1WordsStats } from "./a1-words-oxford";
export { a2Words, a2WordsStats } from "./a2-words-oxford";
export { b1Words, b1WordsStats } from "./b1-words-oxford";
export { b2Words, b2WordsStats } from "./b2-words-oxford";
export { c1Words, c1WordsStats } from "./c1-words-oxford";

// Oxford-3000 Combined exports
export { allOxfordWords, oxfordStats } from "./oxford-3000-index";

// Manager export
export {
  VocabularyManager,
  allVocabularyCards,
  wordCounts,
} from "./vocabularyManager";
export {
  default as VocabularyStudyMethods,
  SpacedRepetitionSystem,
} from "./studyMethods";

// Import for internal use
import { VocabularyManager } from "./vocabularyManager";

// Quick stats for Oxford-3000 implementation
export const vocabularyStats = {
  totalWords: 3805, // Oxford 3000 words processed
  implementedWords: 3805, // All Oxford 3000 words implemented
  levels: ["A1", "A2", "B1", "B2", "C1"] as const,
  wordsByLevel: {
    A1: 1076,
    A2: 990,
    B1: 902,
    B2: 837,
    C1: 0,
  },
  features: [
    "Oxford 3000 Word List",
    "Enhanced Definitions",
    "Spaced Repetition System",
    "Multiple Study Methods",
    "Progress Tracking",
    "Daily Study Goals",
    "Difficulty Levels",
    "Performance Analytics",
  ],
};

// Study method types
export type StudyMethod =
  | "flashcards"
  | "multiple-choice"
  | "fill-in-blank"
  | "sentence-completion"
  | "word-association"
  | "pronunciation"
  | "contextual-usage";

// Default study settings
export const defaultStudySettings = {
  dailyNewWords: 10,
  dailyReviewWords: 20,
  maxCardsPerSession: 30,
  enableSpacedRepetition: true,
  showPhonetics: true,
  autoPlayPronunciation: false,
  cardStyle: "detailed" as const,
  preferredStudyMethods: [
    "flashcards",
    "multiple-choice",
    "fill-in-blank",
  ] as StudyMethod[],
};

// Level progression requirements
export const levelProgression = {
  A1: { requiredWords: 800, nextLevel: "A2" },
  A2: { requiredWords: 1200, nextLevel: "B1" },
  B1: { requiredWords: 1600, nextLevel: "B2" },
  B2: { requiredWords: 2000, nextLevel: "C1" },
  C1: { requiredWords: 2500, nextLevel: "C2" },
};

// Common word tags for filtering
export const commonTags = [
  "basic",
  "common",
  "essential",
  "grammar",
  "food",
  "travel",
  "work",
  "education",
  "family",
  "health",
  "technology",
  "nature",
  "emotions",
  "time",
  "money",
  "clothes",
  "transport",
  "house",
  "body",
  "colors",
  "numbers",
  "directions",
  "weather",
  "sports",
  "culture",
  "business",
  "academic",
  "formal",
];

// Study statistics interface
export interface StudyStatistics {
  totalStudyTime: number;
  wordsLearned: number;
  currentStreak: number;
  maxStreak: number;
  accuracyRate: number;
  favoriteStudyMethod: StudyMethod;
  weakAreas: string[];
  strongAreas: string[];
  dailyGoalProgress: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

// Utility functions
export const vocabularyUtils = {
  // Get words for specific week of study
  getWeeklyWords: (
    weekNumber: number,
    level: "A1" | "A2" | "B1" | "B2" | "C1" = "A1"
  ) => {
    const wordsPerWeek = 50;
    const startIndex = (weekNumber - 1) * wordsPerWeek;
    const endIndex = startIndex + wordsPerWeek;

    return VocabularyManager.getWordsByLevel(level).slice(startIndex, endIndex);
  },

  // Get words for daily study based on 365-day plan
  getDailyWords: (
    dayNumber: number,
    level: "A1" | "A2" | "B1" | "B2" | "C1" = "A1"
  ) => {
    const wordsPerDay = 15;
    const startIndex = (dayNumber - 1) * wordsPerDay;
    const endIndex = startIndex + wordsPerDay;

    return VocabularyManager.getWordsByLevel(level).slice(startIndex, endIndex);
  },

  // Calculate learning velocity
  calculateLearningVelocity: (
    sessionsLastWeek: number,
    wordsLearned: number
  ) => {
    if (sessionsLastWeek === 0) return 0;
    return Math.round((wordsLearned / sessionsLastWeek) * 10) / 10;
  },

  // Get recommendation for next study session
  getStudyRecommendation: (stats: StudyStatistics) => {
    if (stats.accuracyRate < 0.7) {
      return "Focus on reviewing previously learned words";
    }
    if (stats.currentStreak >= 7) {
      return "Great progress! Try challenging yourself with higher level words";
    }
    return "Continue with your current study plan";
  },
};

// Export default configuration
export default {
  vocabularyStats,
  defaultStudySettings,
  levelProgression,
  commonTags,
  vocabularyUtils,
};

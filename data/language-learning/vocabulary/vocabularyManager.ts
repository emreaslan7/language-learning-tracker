import { VocabularyCard } from "./types";
import { allOxfordWords } from "./oxford-3000-index";
import { CloudVocabularyTracker } from "./cloudVocabularyTracker";

// Progress tracking interface
interface WordProgress {
  wordId: string;
  learned: boolean;
  confused: boolean;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  difficulty: number;
}

// VocabularyManager class for managing daily vocabulary distribution
export class VocabularyManager {
  private static readonly STORAGE_KEY = "vocabulary-progress";
  private static readonly USER_DATA_KEY = "vocabulary-user-data";
  private static readonly WORDS_PER_DAY = 10;
  private static readonly TOTAL_DAYS = 365;

  // Get words by level
  static getWordsByLevel(level: string): VocabularyCard[] {
    const allWords = this.getAllWords();
    return allWords.filter((word) => word.level === level);
  }

  // Get all vocabulary cards
  static getAllWords(): VocabularyCard[] {
    return allOxfordWords.map((word) => ({
      ...word,
      confused: word.confused || false, // Ensure confused field exists
    }));
  }

  // Get words for a specific day (1-365)
  static getDailyWords(day: number): VocabularyCard[] {
    if (day < 1 || day > this.TOTAL_DAYS) {
      throw new Error(`Day must be between 1 and ${this.TOTAL_DAYS}`);
    }

    const allWords = this.getAllWords();
    const startIndex = (day - 1) * this.WORDS_PER_DAY;
    const endIndex = Math.min(startIndex + this.WORDS_PER_DAY, allWords.length);

    const dayWords = allWords.slice(startIndex, endIndex);

    // Return basic word data without progress on server-side
    if (typeof window === "undefined") {
      return dayWords.map((word) => ({
        ...word,
        learned: false,
        confused: false,

        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      }));
    }

    // Add progress information to each word only on client-side
    return dayWords.map((word) => ({
      ...word,
      ...this.getWordProgress(word.id),
    }));
  }

  // Get words for a specific day of the week within a week
  static getWeekDayWords(week: number, dayOfWeek: number): VocabularyCard[] {
    if (week < 1 || week > 53) {
      throw new Error("Week must be between 1 and 53");
    }
    if (dayOfWeek < 1 || dayOfWeek > 7) {
      throw new Error("Day of week must be between 1 and 7");
    }

    const globalDay = (week - 1) * 7 + dayOfWeek;
    return this.getDailyWords(globalDay);
  }

  // Get progress for a specific word
  static getWordProgress(wordId: string): Partial<VocabularyCard> {
    // Return default values on server-side
    if (typeof window === "undefined") {
      return {
        learned: false,
        confused: false,

        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };
    }

    const progressData = this.getStoredProgress();
    const progress = progressData[wordId];

    if (!progress) {
      return {
        learned: false,
        confused: false,

        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };
    }

    return {
      learned: progress.learned || false,
      confused: progress.confused || false,
      reviewCount: progress.reviewCount || 0,
      correctCount: progress.correctCount || 0,
      incorrectCount: progress.incorrectCount || 0,
    };
  }

  // Mark a word as learned
  static async markAsLearned(wordId: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const progressData = this.getStoredProgress();
    const currentProgress = progressData[wordId] || {
      wordId,
      learned: false,
      confused: false,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(),
      difficulty: 1,
    };

    const updatedProgress = {
      ...currentProgress,
      learned: true,
      confused: false, // Clear confused when marked as learned
      correctCount: currentProgress.correctCount + 1,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
    };

    progressData[wordId] = updatedProgress;
    this.saveProgress(progressData);

    // Auto sync to Firebase
    try {
      await CloudVocabularyTracker.autoSyncProgress(updatedProgress);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      }
    } catch (error) {
      console.error("Vocabulary progress auto sync hatası:", error);
    }
  }

  // Mark a word as incorrect/confused
  static async markAsIncorrect(wordId: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const progressData = this.getStoredProgress();
    const currentProgress = progressData[wordId] || {
      wordId,
      learned: false,
      confused: false,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(),
      difficulty: 1,
    };

    const updatedProgress = {
      ...currentProgress,
      confused: true,
      learned: false, // Clear learned when marked as confused
      incorrectCount: currentProgress.incorrectCount + 1,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours later
    };

    progressData[wordId] = updatedProgress;
    this.saveProgress(progressData);

    // Auto sync to Firebase
    try {
      await CloudVocabularyTracker.autoSyncProgress(updatedProgress);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      }
    } catch (error) {
      console.error("Vocabulary progress auto sync hatası:", error);
    }
  }

  // Reset word status (clear learned and confused)
  static async resetWordStatus(wordId: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const progressData = this.getStoredProgress();
    const currentProgress = progressData[wordId] || {
      wordId,
      learned: false,
      confused: false,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(),
      difficulty: 1,
    };

    const updatedProgress = {
      ...currentProgress,
      learned: false,
      confused: false,
      lastReviewDate: new Date(),
    };

    progressData[wordId] = updatedProgress;
    this.saveProgress(progressData);

    // Auto sync to Firebase
    try {
      await CloudVocabularyTracker.autoSyncProgress(updatedProgress);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      }
    } catch (error) {
      console.error("Vocabulary progress auto sync hatası:", error);
    }
  }

  // Get stored progress data
  private static getStoredProgress(): Record<string, WordProgress> {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error reading progress data:", error);
      return {};
    }
  }

  // Save progress data
  private static saveProgress(
    progressData: Record<string, WordProgress>
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error("Error saving progress data:", error);
    }
  }

  // Get all learned words
  static getLearnedWords(): VocabularyCard[] {
    const allWords = this.getAllWords();
    const progressData = this.getStoredProgress();

    return allWords.filter((word) => {
      const progress = progressData[word.id];
      return progress && progress.learned;
    });
  }

  // Get all confused words
  static getConfusedWords(): VocabularyCard[] {
    const allWords = this.getAllWords();
    const progressData = this.getStoredProgress();

    return allWords.filter((word) => {
      const progress = progressData[word.id];
      return progress && progress.confused;
    });
  }

  // Get overall progress statistics
  static getOverallProgress(): {
    total: number;
    learned: number;
    confused: number;
    notStudied: number;
    learningPercentage: number;
    confusedPercentage: number;
  } {
    if (typeof window === "undefined") {
      return {
        total: 0,
        learned: 0,
        confused: 0,
        notStudied: 0,
        learningPercentage: 0,
        confusedPercentage: 0,
      };
    }

    const allWords = this.getAllWords();
    const progressData = this.getStoredProgress();

    let learned = 0;
    let confused = 0;

    allWords.forEach((word) => {
      const progress = progressData[word.id];
      if (progress) {
        if (progress.learned) learned++;
        else if (progress.confused) confused++;
      }
    });

    const total = allWords.length;
    const notStudied = total - learned - confused;

    return {
      total,
      learned,
      confused,
      notStudied,
      learningPercentage: Math.round((learned / total) * 100),
      confusedPercentage: Math.round((confused / total) * 100),
    };
  }

  // User data methods for definitions and examples
  static async saveUserData(
    wordId: string,
    data: { definition?: string; examples?: string[] }
  ): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const userData = this.getUserData();
      const updatedData = {
        ...userData[wordId],
        ...data,
      };

      userData[wordId] = updatedData;
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));

      // Auto sync to Firebase
      try {
        await CloudVocabularyTracker.autoSyncUserData(wordId, updatedData);

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
        }
      } catch (error) {
        console.error("Vocabulary user data auto sync hatası:", error);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }

  static getUserDataForWord(wordId: string): {
    definition?: string;
    examples?: string[];
  } {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const userData = this.getUserData();
      return userData[wordId] || {};
    } catch (error) {
      console.error("Error getting user data:", error);
      return {};
    }
  }

  private static getUserData(): Record<
    string,
    { definition?: string; examples?: string[] }
  > {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const stored = localStorage.getItem(this.USER_DATA_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error reading user data:", error);
      return {};
    }
  }

  // Clear all user data for a word
  static async clearUserData(wordId: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const userData = this.getUserData();
      delete userData[wordId];
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));

      // Auto sync to Firebase (boş obje gönder)
      try {
        await CloudVocabularyTracker.autoSyncUserData(wordId, {});

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
        }
      } catch (error) {
        console.error("Vocabulary user data clear auto sync hatası:", error);
      }
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }

  // Firebase sync metodları
  static async syncAllData(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      console.log("🔄 Vocabulary: Tüm veri sync başlatılıyor...");
      await CloudVocabularyTracker.syncAllVocabularyData();
      console.log("✅ Vocabulary: Tüm veri sync tamamlandı");
    } catch (error) {
      console.error("❌ Vocabulary: Sync hatası:", error);
    }
  }

  static async syncProgressData(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      console.log("🔄 Vocabulary: Progress sync başlatılıyor...");
      await CloudVocabularyTracker.syncProgressData();
      console.log("✅ Vocabulary: Progress sync tamamlandı");
    } catch (error) {
      console.error("❌ Vocabulary: Progress sync hatası:", error);
    }
  }

  static async syncUserData(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      console.log("🔄 Vocabulary: User data sync başlatılıyor...");
      await CloudVocabularyTracker.syncUserData();
      console.log("✅ Vocabulary: User data sync tamamlandı");
    } catch (error) {
      console.error("❌ Vocabulary: User data sync hatası:", error);
    }
  }
}

// Export vocabulary cards for compatibility
export const allVocabularyCards = allOxfordWords;

// Export word counts for compatibility
export const wordCounts = {
  total: allOxfordWords.length,
  byLevel: {
    A1: allOxfordWords.filter((w) => w.level === "A1").length,
    A2: allOxfordWords.filter((w) => w.level === "A2").length,
    B1: allOxfordWords.filter((w) => w.level === "B1").length,
    B2: allOxfordWords.filter((w) => w.level === "B2").length,
    C1: allOxfordWords.filter((w) => w.level === "C1").length,
  },
};

// Default export
export default VocabularyManager;

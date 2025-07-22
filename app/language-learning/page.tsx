"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressTracker } from "../../data/language-learning/progressTracker";
import {
  VocabularyManager,
  vocabularyStats,
} from "../../data/language-learning/vocabulary";
import { VocabularyCard } from "../../data/language-learning/vocabulary/types";

interface WeekData {
  week: number;
  title: string;
  focus: string;
  phase: "B1-B2" | "B2-C1" | "C1-IELTS" | "C1-FINAL";
  completed: boolean;
}

interface ProgressData {
  weekNumber: number;
  dayNumber: number;
  completionPercentage: number;
}

interface Stats {
  completedDays: number;
  partialDays: number;
  uncompletedDays: number;
  overallPercentage: number;
  currentStreak: number;
}

interface VocabularyProgress {
  learned: number;
  confused: number;
}

// GitHub Contributions Component
const YearlyProgressChart = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [stats, setStats] = useState<Stats>({
    completedDays: 0,
    partialDays: 0,
    uncompletedDays: 0,
    overallPercentage: 0,
    currentStreak: 0,
  });
  const [mounted, setMounted] = useState(false);

  // Progress verilerini yenile
  const refreshProgressData = () => {
    const data = ProgressTracker.getYearlyProgress();
    const statsData = ProgressTracker.getOverallStats();
    setProgressData(data);
    setStats(statsData);
  };

  // Vocabulary verilerini yenile
  const refreshVocabularyData = () => {
    if (typeof window !== "undefined") {
      // Vocabulary progress state'ini güncelle (eğer varsa)
      window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
    }
  };

  useEffect(() => {
    setMounted(true);

    // İlk önce localStorage'dan verileri hemen yükle
    refreshProgressData();

    const loadData = async () => {
      // Cloud sync'i başlat (main progress)
      try {
        await ProgressTracker.initCloudSync();
        console.log("✅ Main progress cloud sync başlatıldı");

        // Cloud sync'ten sonra verileri yeniden yükle
        refreshProgressData();
      } catch (error) {
        console.warn("⚠️ Main progress cloud sync başlatılamadı:", error);
      }

      // 🚀 YENİ VOCABULARY SİSTEMİ: Firebase → localStorage → Firebase döngüsü
      try {
        await VocabularyManager.initializeVocabulary();

        // Vocabulary verileri yüklendikten sonra UI'ı refresh et
        refreshVocabularyData();
      } catch (error) {
        console.warn("⚠️ Vocabulary Firebase döngüsü başlatılamadı:", error);
      }
    };

    loadData();

    // localStorage değişikliklerini dinle
    const handleStorageChange = () => {
      refreshProgressData();
    };

    // localStorage değişiklik eventini dinle
    window.addEventListener("storage", handleStorageChange);

    // Custom event dinle (aynı tab'da değişiklikler için)
    const handleCustomStorageChange = () => {
      setTimeout(() => refreshProgressData(), 100); // Küçük delay ekle
    };
    window.addEventListener("localStorageChanged", handleCustomStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChanged",
        handleCustomStorageChange
      );
    };
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          365-Day Progress Map
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
          365-Day Progress Map
        </h2>
      </div>

      <div className="text-gray-600 dark:text-gray-300 mb-6">
        GitHub contributions style daily activity tracking
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.completedDays || 0}
          </div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold dark:text-white">
            {stats.partialDays || 0}
          </div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold dark:text-white">
            {stats.uncompletedDays || 0}
          </div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold dark:text-white">
            {stats.overallPercentage || 0}%
          </div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </div>

      {/* GitHub-style contributions chart */}
      <div className="mb-4 overflow-x-auto">
        {/* Desktop view */}
        <div className="hidden md:block min-w-full">
          {/* Week numbers header */}
          <div className="grid grid-cols-52 gap-1 mb-2 min-w-[800px]">
            {Array.from({ length: 52 }, (_, weekIndex) => (
              <div key={weekIndex} className="text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {weekIndex + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Progress squares grouped by weeks */}
          <div className="grid grid-cols-52 gap-1 min-w-[800px]">
            {Array.from({ length: 52 }, (_, weekIndex) => {
              const weekNumber = weekIndex + 1;
              const weekDays = progressData.filter(
                (day) => day.weekNumber === weekNumber
              );

              // Eğer haftada hiç gün yoksa, boş günler oluştur
              if (weekDays.length === 0) {
                const emptyDays = Array.from({ length: 7 }, (_, dayIndex) => ({
                  weekNumber,
                  dayNumber: dayIndex + 1,
                  completionPercentage: 0,
                }));

                return (
                  <div
                    key={weekIndex}
                    className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1"
                  >
                    {emptyDays.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-2 h-2 rounded-sm ${ProgressTracker.getCompletionColor(
                          day.completionPercentage
                        )} hover:scale-125 transition-all cursor-pointer mx-auto`}
                        title={`Week ${day.weekNumber}, Day ${day.dayNumber}: ${day.completionPercentage}%`}
                      />
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={weekIndex}
                  className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1"
                >
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    const dayData = weekDays.find(
                      (day) => day.dayNumber === dayNumber
                    );
                    const completionPercentage = dayData
                      ? dayData.completionPercentage
                      : 0;

                    return (
                      <div
                        key={dayIndex}
                        className={`w-2 h-2 rounded-sm ${ProgressTracker.getCompletionColor(
                          completionPercentage
                        )} hover:scale-125 transition-all cursor-pointer mx-auto`}
                        title={`Week ${weekNumber}, Day ${dayNumber}: ${completionPercentage}%`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile view - Quarterly breakdown */}
        <div className="md:hidden">
          <div className="space-y-6">
            {/* Quarter 1 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Q1 (Weeks 1-13)
              </h4>
              <div className="grid grid-cols-13 gap-1">
                {Array.from({ length: 13 }, (_, weekIndex) => {
                  const weekNumber = weekIndex + 1;
                  const weekDays = progressData.filter(
                    (day) => day.weekNumber === weekNumber
                  );

                  return (
                    <div key={weekIndex} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {weekNumber}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const dayNumber = dayIndex + 1;
                          const dayData = weekDays.find(
                            (day) => day.dayNumber === dayNumber
                          );
                          const completionPercentage = dayData
                            ? dayData.completionPercentage
                            : 0;

                          return (
                            <div
                              key={dayIndex}
                              className={`w-1.5 h-1.5 rounded-sm ${ProgressTracker.getCompletionColor(
                                completionPercentage
                              )} mx-auto`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quarter 2 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Q2 (Weeks 14-26)
              </h4>
              <div className="grid grid-cols-13 gap-1">
                {Array.from({ length: 13 }, (_, weekIndex) => {
                  const weekNumber = weekIndex + 14;
                  const weekDays = progressData.filter(
                    (day) => day.weekNumber === weekNumber
                  );

                  return (
                    <div key={weekIndex + 13} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {weekNumber}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const dayNumber = dayIndex + 1;
                          const dayData = weekDays.find(
                            (day) => day.dayNumber === dayNumber
                          );
                          const completionPercentage = dayData
                            ? dayData.completionPercentage
                            : 0;

                          return (
                            <div
                              key={dayIndex}
                              className={`w-1.5 h-1.5 rounded-sm ${ProgressTracker.getCompletionColor(
                                completionPercentage
                              )} mx-auto`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quarter 3 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Q3 (Weeks 27-39)
              </h4>
              <div className="grid grid-cols-13 gap-1">
                {Array.from({ length: 13 }, (_, weekIndex) => {
                  const weekNumber = weekIndex + 27;
                  const weekDays = progressData.filter(
                    (day) => day.weekNumber === weekNumber
                  );

                  return (
                    <div key={weekIndex + 26} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {weekNumber}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const dayNumber = dayIndex + 1;
                          const dayData = weekDays.find(
                            (day) => day.dayNumber === dayNumber
                          );
                          const completionPercentage = dayData
                            ? dayData.completionPercentage
                            : 0;

                          return (
                            <div
                              key={dayIndex}
                              className={`w-1.5 h-1.5 rounded-sm ${ProgressTracker.getCompletionColor(
                                completionPercentage
                              )} mx-auto`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quarter 4 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Q4 (Weeks 40-52)
              </h4>
              <div className="grid grid-cols-13 gap-1">
                {Array.from({ length: 13 }, (_, weekIndex) => {
                  const weekNumber = weekIndex + 40;
                  const weekDays = progressData.filter(
                    (day) => day.weekNumber === weekNumber
                  );

                  return (
                    <div key={weekIndex + 39} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {weekNumber}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 flex flex-col gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const dayNumber = dayIndex + 1;
                          const dayData = weekDays.find(
                            (day) => day.dayNumber === dayNumber
                          );
                          const completionPercentage = dayData
                            ? dayData.completionPercentage
                            : 0;

                          return (
                            <div
                              key={dayIndex}
                              className={`w-1.5 h-1.5 rounded-sm ${ProgressTracker.getCompletionColor(
                                completionPercentage
                              )} mx-auto`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-green-800"></div>
          <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-700"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-500"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-400"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default function LanguageLearning() {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [overallStats, setOverallStats] = useState<Stats>({
    completedDays: 0,
    partialDays: 0,
    uncompletedDays: 0,
    overallPercentage: 0,
    currentStreak: 0,
  });
  const [currentWeek, setCurrentWeek] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [vocabularyProgress, setVocabularyProgress] =
    useState<VocabularyProgress>({
      learned: 0,
      confused: 0,
    });
  const [showWordsModal, setShowWordsModal] = useState(false);
  const [modalType, setModalType] = useState<"learned" | "confused">("learned");
  const [modalWords, setModalWords] = useState<VocabularyCard[]>([]);
  const [showWordDetailModal, setShowWordDetailModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyCard | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [editableDefinition, setEditableDefinition] = useState("");
  const [editableExamples, setEditableExamples] = useState<string[]>([""]);
  const router = useRouter();

  // Progress verilerini yükle - sadece client-side
  useEffect(() => {
    setMounted(true);
    const stats = ProgressTracker.getOverallStats();
    const activeWeek = ProgressTracker.getCurrentActiveWeek();
    const vocabProgress = VocabularyManager.getOverallProgress();
    setOverallStats(stats);
    setCurrentWeek(activeWeek);
    setVocabularyProgress(vocabProgress);

    // Vocabulary değişikliklerini dinle
    const handleVocabularyChange = () => {
      const vocabProgress = VocabularyManager.getOverallProgress();
      setVocabularyProgress(vocabProgress);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "vocabularyProgressChanged",
        handleVocabularyChange
      );

      // Cleanup
      return () => {
        window.removeEventListener(
          "vocabularyProgressChanged",
          handleVocabularyChange
        );
      };
    }
  }, []);

  // Handle opening words modal
  const handleOpenWordsModal = (type: "learned" | "confused") => {
    setModalType(type);

    let words;
    if (type === "learned") {
      words = VocabularyManager.getLearnedWords();
    } else {
      words = VocabularyManager.getConfusedWords();
    }

    setModalWords(words);
    setShowWordsModal(true);
  };

  // Handle opening word detail modal
  const handleOpenWordDetail = (word: VocabularyCard) => {
    setSelectedWord(word);
    setShowWordDetailModal(true);
    setIsCardFlipped(false);

    // Load user data if available, otherwise use original data
    const userData = VocabularyManager.getUserDataForWord(word.id);
    if (userData) {
      setEditableDefinition(userData.definition || "");
      setEditableExamples(
        userData.examples && userData.examples.length > 0
          ? userData.examples
          : [""]
      );
    } else {
      setEditableDefinition(word.definition || "");
      setEditableExamples(word.examples || [""]);
    }
  };

  // Handle closing word detail modal
  const handleCloseWordDetail = () => {
    setShowWordDetailModal(false);
    setSelectedWord(null);
    setIsCardFlipped(false);
    setEditableDefinition("");
    setEditableExamples([""]);
  };

  // Flip card methods
  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleAddExample = () => {
    setEditableExamples([...editableExamples, ""]);
  };

  const handleRemoveExample = (index: number) => {
    if (editableExamples.length > 1) {
      setEditableExamples(editableExamples.filter((_, i) => i !== index));
    }
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...editableExamples];
    newExamples[index] = value;
    setEditableExamples(newExamples);
  };

  const handleSaveUserData = () => {
    if (!selectedWord) return;

    VocabularyManager.saveUserData(selectedWord.id, {
      definition: editableDefinition,
      examples: editableExamples,
    });
    // Show a brief success message or indication
    alert("Definition and examples saved successfully!");
  };

  const handleLearningStatus = (
    status: "not-learned" | "confused" | "learned"
  ) => {
    if (!selectedWord) return;

    if (status === "learned") {
      VocabularyManager.markAsLearned(selectedWord.id);
    } else if (status === "confused") {
      VocabularyManager.markAsIncorrect(selectedWord.id);
    } else if (status === "not-learned") {
      VocabularyManager.resetWordStatus(selectedWord.id);
    }

    // Refresh vocabulary progress
    const vocabProgress = VocabularyManager.getOverallProgress();
    setVocabularyProgress(vocabProgress);

    handleCloseWordDetail();
  };

  // Server-side rendering sırasında loading state göster
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        {" "}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  // 365-Day Plan - Weekly Structure
  const weeklyPlan: WeekData[] = [
    // PHASE 1: B1 CONSOLIDATION & B2 FOUNDATIONS (Weeks 1-16)
    {
      week: 1,
      title: "B1 Foundations and Daily Routines",
      focus: "Present Simple & Continuous, basic daily vocabulary",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 2,
      title: "Past Tenses and Travel",
      focus: "Past Simple & Continuous, travel vocabulary",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 3,
      title: "Future Tenses and Plans",
      focus: "Future Simple (will) & Be Going To, planning vocabulary",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 4,
      title: "Modal Verbs",
      focus: "Can, Could, Should, Must - ability, advice, probability",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 5,
      title: "Present Perfect Continuous",
      focus: "Duration of experiences, ongoing situations",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 6,
      title: "Passive Voice Basics",
      focus: "Present Perfect, Future Simple passive",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 7,
      title: "Prepositions",
      focus: "Place, time, direction prepositions",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 8,
      title: "Adjectives and Adverbs",
      focus: "Types, positions, comparisons",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 9,
      title: "Conditional Sentences",
      focus: "Second Conditional, assumptions",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 10,
      title: "Relative Clauses",
      focus: "Non-defining relative clauses",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 11,
      title: "Reported Speech",
      focus: "Reporting questions and commands",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 12,
      title: "Phrasal Verbs",
      focus: "Common phrasal verbs",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 13,
      title: "B1-B2 General Review",
      focus: "Complete B1-B2 grammar review",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 14,
      title: "Vocabulary Expansion",
      focus: "Work, education, environment vocabulary",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 15,
      title: "IELTS Format Introduction",
      focus: "Listening & Reading format and instructions",
      phase: "B1-B2",
      completed: false,
    },
    {
      week: 16,
      title: "First IELTS Practice Test",
      focus: "Full practice test and detailed analysis",
      phase: "B1-B2",
      completed: false,
    },

    // PHASE 2: B2 MASTERY AND C1 INTRODUCTION (Weeks 17-32)
    {
      week: 17,
      title: "Advanced Conditional Sentences",
      focus: "Second & Third Conditional mastery",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 18,
      title: "Advanced Reported Speech",
      focus: "Tense shifting, modal verbs reporting",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 19,
      title: "Advanced Passive Voice",
      focus: "All tenses passive, modal + passive",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 20,
      title: "Inversion (For Emphasis)",
      focus: "Never, Seldom, Hardly with inversion",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 21,
      title: "Cleft Sentences",
      focus: "It is...that, What...is structures",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 22,
      title: "Advanced Connectors",
      focus: "However, Moreover, Consequently",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 23,
      title: "Paraphrasing",
      focus: "Synonyms, word transformation",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 24,
      title: "IELTS Listening 3&4",
      focus: "Academic talks, note-taking",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 25,
      title: "IELTS Reading T/F/NG",
      focus: "True/False/Not Given strategies",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 26,
      title: "IELTS Reading Matching",
      focus: "Paragraph headings, scanning/skimming",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 27,
      title: "IELTS Writing Task 1",
      focus: "Describing graphs, tables, maps",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 28,
      title: "IELTS Writing Task 2 Planning",
      focus: "Creating outlines, organizing",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 29,
      title: "IELTS Speaking Part 2",
      focus: "1-2 minute monologue practice",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 30,
      title: "IELTS Speaking Part 3",
      focus: "Abstract topics, discussion skills",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 31,
      title: "B2 General Review",
      focus: "IELTS-focused weakness strengthening",
      phase: "B2-C1",
      completed: false,
    },
    {
      week: 32,
      title: "Second IELTS Practice",
      focus: "Full practice test and error analysis",
      phase: "B2-C1",
      completed: false,
    },

    // PHASE 3: C1 DEVELOPMENT AND IELTS FOCUSED PREPARATION (Weeks 33-48)
    {
      week: 33,
      title: "C1 Complex Structures",
      focus: "Mixed Conditionals, Advanced Inversion",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 34,
      title: "C1 Idioms and Collocations",
      focus: "Advanced level phrase combinations",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 35,
      title: "IELTS Writing Argumentative",
      focus: "Persuasive essays, counterarguments",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 36,
      title: "IELTS Speaking Fluency",
      focus: "Error reduction, natural flow",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 37,
      title: "IELTS Listening Speed",
      focus: "Fast speech, detail catching",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 38,
      title: "IELTS Reading Difficult Texts",
      focus: "Academic texts, time management",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 39,
      title: "IELTS General Strategies",
      focus: "Strategies for all question types",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 40,
      title: "Third IELTS Practice",
      focus: "Comprehensive performance analysis",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 41,
      title: "Listening & Reading Focus",
      focus: "Targeted practice for weak areas",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 42,
      title: "Writing & Speaking Focus",
      focus: "Targeted practice for weak areas",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 43,
      title: "IELTS Writing Speed",
      focus: "Timely and error-free writing",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 44,
      title: "IELTS Speaking Pronunciation",
      focus: "Pronunciation, intonation, stress",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 45,
      title: "Practice Marathon 1",
      focus: "2 full practice tests per week",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 46,
      title: "Practice Marathon 2",
      focus: "Error analysis and correction",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 47,
      title: "General Review",
      focus: "Reinforcing all strategies",
      phase: "C1-IELTS",
      completed: false,
    },
    {
      week: 48,
      title: "Final Practice and Mental Preparation",
      focus: "Exam anxiety management",
      phase: "C1-IELTS",
      completed: false,
    },

    // PHASE 4: C1 REINFORCEMENT AND FINAL PRE-EXAM PREPARATION (Weeks 49-52)
    {
      week: 49,
      title: "General Review",
      focus: "Complete grammar and vocabulary review",
      phase: "C1-FINAL",
      completed: false,
    },
    {
      week: 50,
      title: "Exam Strategies",
      focus: "Automating strategies",
      phase: "C1-FINAL",
      completed: false,
    },
    {
      week: 51,
      title: "Final Practice",
      focus: "Final performance evaluation",
      phase: "C1-FINAL",
      completed: false,
    },
    {
      week: 52,
      title: "Exam Week",
      focus: "Mental preparation and relaxation",
      phase: "C1-FINAL",
      completed: false,
    },
  ];

  const filteredWeeks =
    selectedPhase === "all"
      ? weeklyPlan
      : weeklyPlan.filter((week) => week.phase === selectedPhase);

  const phaseColors = {
    "B1-B2": "bg-blue-100 text-blue-800 border-blue-200",
    "B2-C1": "bg-green-100 text-green-800 border-green-200",
    "C1-IELTS": "bg-purple-100 text-purple-800 border-purple-200",
    "C1-FINAL": "bg-red-100 text-red-800 border-red-200",
  };

  // Daily progress percentage
  const dailyProgressPercentage = overallStats.overallPercentage || 0;

  return (
    <>
      {/* Add flip card CSS */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Words Modal */}
      {showWordsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {modalType === "learned" ? "Learned Words" : "Confused Words"} (
                {modalWords.length})
              </h2>
              <button
                onClick={() => setShowWordsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modalWords.map((word, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all ${
                      modalType === "learned"
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    }`}
                    onClick={() => handleOpenWordDetail(word)}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {word.word}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {word.phonetic}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      {word.definition}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Level: {word.level}
                    </div>
                  </div>
                ))}
              </div>
              {modalWords.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No {modalType} words yet. Keep studying!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Word Detail Modal */}
      {showWordDetailModal && selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            {/* Close button */}
            <button
              onClick={handleCloseWordDetail}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Card container with flip animation */}
            <div className="relative w-full h-96 perspective-1000">
              <div
                className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
                  isCardFlipped ? "rotate-y-180" : ""
                }`}
                onClick={flipCard}
              >
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-200 dark:border-purple-600 h-full flex flex-col">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-t-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {selectedWord.level}
                        </span>
                        <span className="text-sm">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {selectedWord.word}
                      </h2>
                      <div className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        {selectedWord.phonetic || ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Click to see definition
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-200 dark:border-purple-600 h-full flex flex-col">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {selectedWord.level}
                        </span>
                        <span className="text-sm">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Definition:
                          </h3>
                          <textarea
                            value={editableDefinition}
                            onChange={(e) =>
                              setEditableDefinition(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                            placeholder="Enter definition..."
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Examples:
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddExample();
                              }}
                              className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                              + Add Example
                            </button>
                          </div>
                          <div className="space-y-2">
                            {editableExamples.map((example, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="text"
                                  value={example}
                                  onChange={(e) =>
                                    handleExampleChange(index, e.target.value)
                                  }
                                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder={`Example ${index + 1}...`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                {editableExamples.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveExample(index);
                                    }}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveUserData();
                          }}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                        >
                          💾 Save Definition & Examples
                        </button>
                      </div>

                      {/* Learning Status buttons */}
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLearningStatus("not-learned");
                          }}
                          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                        >
                          Not Learned
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLearningStatus("confused");
                          }}
                          className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                        >
                          Confused
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLearningStatus("learned");
                          }}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                        >
                          Learned
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              365-Day B1 → C1 & IELTS Preparation Plan
            </h1>
            <div className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Detailed, week-by-week planned English learning journey. The path
              from B1 level to C1 level and IELTS success.
            </div>

            {/* Debug Vocabulary Sync Button */}
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={async () => {
                  console.log("🔧 Manuel vocabulary sync başlatılıyor...");
                  try {
                    await VocabularyManager.forceUploadToFirebase();
                    alert(
                      "Vocabulary data Firebase'e gönderildi! Console'u kontrol edin."
                    );
                  } catch (error) {
                    console.error("Sync hatası:", error);
                    alert("Sync hatası! Console'u kontrol edin.");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                🔧 Debug: Vocabulary Sync to Firebase
              </button>

              <button
                onClick={() => {
                  console.log("📊 LocalStorage Vocabulary Debug:");
                  const progressData = localStorage.getItem(
                    "vocabulary-progress"
                  );
                  const userData = localStorage.getItem("vocabulary-user-data");

                  if (progressData) {
                    const parsed = JSON.parse(progressData);
                    console.log("Progress Data:", {
                      kelimeSayisi: Object.keys(parsed).length,
                      kelimeler: Object.keys(parsed),
                      detay: parsed,
                    });
                  } else {
                    console.log("❌ Progress data bulunamadı");
                  }

                  if (userData) {
                    const parsed = JSON.parse(userData);
                    console.log("User Data:", {
                      kelimeSayisi: Object.keys(parsed).length,
                      kelimeler: Object.keys(parsed),
                      detay: parsed,
                    });
                  } else {
                    console.log("❌ User data bulunamadı");
                  }

                  alert("localStorage verisi console'a yazdırıldı!");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                📊 Debug: Check localStorage
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Overall Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Overall Progress
              </h2>
              <div className="space-y-4">
                {/* Daily Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Activity
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {dailyProgressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${dailyProgressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Progress based on 365-day activities
                  </div>
                </div>

                {/* Vocabulary Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Vocabulary Learning
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {vocabularyProgress.learned || 0} /{" "}
                      {vocabularyStats.totalWords}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((vocabularyProgress.learned || 0) /
                            vocabularyStats.totalWords) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(vocabularyStats.totalWords / 365)} words per day
                    target
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {overallStats.completedDays || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Completed Days
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {overallStats.currentStreak || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Current Streak
                    </div>
                  </div>
                  <div
                    className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    onClick={() => handleOpenWordsModal("learned")}
                  >
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {vocabularyProgress.learned || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Words Learned
                    </div>
                  </div>
                  <div
                    className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    onClick={() => handleOpenWordsModal("confused")}
                  >
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {vocabularyProgress.confused || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Confused Words
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Week */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Active Week (Week {currentWeek})
              </h2>
              <div className="space-y-4">
                {weeklyPlan.find((week) => week.week === currentWeek) && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
                        {
                          weeklyPlan.find((week) => week.week === currentWeek)
                            ?.title
                        }
                      </h3>
                      <div className="text-sm text-green-700 dark:text-green-400">
                        {
                          weeklyPlan.find((week) => week.week === currentWeek)
                            ?.focus
                        }
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/language-learning/week-${currentWeek}`)
                      }
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Start This Week
                    </button>

                    {/* Weekly Progress Detail */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Weekly Progress Detail
                      </h4>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                          const dayProgress =
                            ProgressTracker.getDayCompletionPercentage(
                              currentWeek,
                              day
                            );
                          return (
                            <div
                              key={day}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {
                                  [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                  ][day - 1]
                                }
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${dayProgress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                                  {dayProgress}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* GitHub-style Daily Progress Chart */}
          <div className="max-w-6xl mx-auto mb-16">
            <YearlyProgressChart />
          </div>

          {/* Phase Filter */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Plan Phases
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedPhase("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === "all"
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  All Phases
                </button>
                <button
                  onClick={() => setSelectedPhase("B1-B2")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === "B1-B2"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                  }`}
                >
                  Phase 1: B1 Reinforcement (1-16)
                </button>
                <button
                  onClick={() => setSelectedPhase("B2-C1")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === "B2-C1"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                  }`}
                >
                  Phase 2: B2 Mastery (17-32)
                </button>
                <button
                  onClick={() => setSelectedPhase("C1-IELTS")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === "C1-IELTS"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
                  }`}
                >
                  Phase 3: C1 & IELTS (33-48)
                </button>
                <button
                  onClick={() => setSelectedPhase("C1-FINAL")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === "C1-FINAL"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                  }`}
                >
                  Phase 4: Final Preparation (49-52)
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Plan Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              52-Week Detailed Plan
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWeeks.map((week) => {
                // Calculate week completion percentage
                const weekCompletion = (() => {
                  if (week.completed) return 100;
                  if (week.week === currentWeek)
                    return overallStats.overallPercentage || 0;
                  if (week.week > currentWeek) return 0; // Future weeks

                  // Past weeks that aren't marked as completed - calculate based on progress
                  let totalDays = 0;
                  let completedDays = 0;
                  for (let day = 1; day <= 7; day++) {
                    const dayProgress =
                      ProgressTracker.getDayCompletionPercentage(
                        week.week,
                        day
                      );
                    totalDays++;
                    if (dayProgress >= 50) completedDays++; // Consider 50%+ as completed
                  }
                  return Math.round((completedDays / totalDays) * 100);
                })();

                // Get background color based on completion percentage
                const getBackgroundColor = (
                  percentage: number,
                  isActive: boolean,
                  isPastWeek: boolean
                ) => {
                  if (isActive) return "bg-white dark:bg-gray-800"; // Active week stays normal
                  if (percentage === 100)
                    return "bg-green-200 dark:bg-green-800/40"; // Bright green for 100% completed
                  if (percentage >= 50)
                    return "bg-green-50 dark:bg-green-900/20"; // Green for 50-99%
                  if (percentage > 0)
                    return "bg-yellow-50 dark:bg-yellow-900/20"; // Yellow for 1-49%
                  if (isPastWeek && percentage === 0)
                    return "bg-red-100 dark:bg-red-900/25"; // Red for past weeks with 0% progress
                  return "bg-white dark:bg-gray-800";
                };

                // Get border color based on completion percentage
                const getBorderColor = (
                  percentage: number,
                  isActive: boolean,
                  isPastWeek: boolean
                ) => {
                  if (isActive) return "border-green-500"; // Active week has green border
                  if (percentage === 100)
                    return "border-green-500 dark:border-green-400"; // Bright green border for 100% completed
                  if (percentage >= 50)
                    return "border-green-200 dark:border-green-700"; // Green border for 50-99%
                  if (percentage > 0)
                    return "border-yellow-200 dark:border-yellow-700"; // Yellow border for 1-49%
                  if (isPastWeek && percentage === 0)
                    return "border-red-400 dark:border-red-600"; // Red border for past weeks with 0% progress
                  return "border-gray-200 dark:border-gray-700";
                };

                return (
                  <div
                    key={week.week}
                    className={`${getBackgroundColor(
                      weekCompletion,
                      week.week === currentWeek,
                      week.week < currentWeek
                    )} rounded-xl shadow-lg p-6 border ${getBorderColor(
                      weekCompletion,
                      week.week === currentWeek,
                      week.week < currentWeek
                    )} hover:shadow-xl transition-all duration-300 cursor-pointer ${
                      week.week === currentWeek ? "ring-2 ring-green-500" : ""
                    }`}
                    onClick={() => {
                      setCurrentWeek(week.week);
                      router.push(`/language-learning/week-${week.week}`);
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {week.week}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            phaseColors[week.phase]
                          }`}
                        >
                          {week.phase}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            weekCompletion === 100
                              ? "bg-green-500 text-white"
                              : week.week === currentWeek
                              ? "bg-yellow-500 text-white"
                              : week.week < currentWeek && weekCompletion === 0
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          {weekCompletion === 100
                            ? "✓"
                            : week.week === currentWeek
                            ? "●"
                            : week.week < currentWeek && weekCompletion === 0
                            ? "✕"
                            : ""}
                        </div>
                        {/* Show completion percentage for non-active weeks */}
                        {week.week !== currentWeek && weekCompletion > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {weekCompletion}%
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {week.title}
                    </h3>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {week.focus}
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-medium ${
                          weekCompletion === 100
                            ? "text-green-600 dark:text-green-400"
                            : week.week === currentWeek
                            ? "text-yellow-600 dark:text-yellow-400"
                            : week.week < currentWeek && weekCompletion === 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {weekCompletion === 100
                          ? "Completed"
                          : week.week === currentWeek
                          ? "Active"
                          : week.week < currentWeek && weekCompletion === 0
                          ? "Missed"
                          : "Pending"}
                      </span>

                      <button
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          weekCompletion === 100
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                            : week.week === currentWeek
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
                            : week.week < currentWeek && weekCompletion === 0
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {weekCompletion === 100
                          ? "Review"
                          : week.week === currentWeek
                          ? "Continue"
                          : week.week < currentWeek && weekCompletion === 0
                          ? "Catch Up"
                          : "Start"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Study Template */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Daily Study Template (1.5-2 Hours)
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                    Warm-up
                  </h3>
                  <div className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                    10 minutes
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Review vocabulary from previous day
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
                    Main Focus
                  </h3>
                  <div className="text-sm text-green-700 dark:text-green-400 mb-2">
                    30-40 minutes
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Day&apos;s main topic
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">
                    Practice
                  </h3>
                  <div className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                    20-30 minutes
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Writing and speaking practice
                  </div>
                </div>

                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-2">
                    Review
                  </h3>
                  <div className="text-sm text-orange-700 dark:text-orange-400 mb-2">
                    5-10 minutes
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Day&apos;s notes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Resources */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Recommended Resources
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  📚 Grammar
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>
                    • Raymond Murphy &quot;English Grammar in Use&quot; (B1-B2)
                  </li>
                  <li>• Cambridge Grammar of English</li>
                  <li>• Practical English Usage</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  🎧 Listening
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• VOA Learning English</li>
                  <li>• BBC 6 Minute English</li>
                  <li>• All Ears English Podcast</li>
                  <li>• TED Talks</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  📖 Reading
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• British Council Reading</li>
                  <li>• National Geographic &quot;Reading Explorer&quot;</li>
                  <li>• News in Levels</li>
                  <li>• The Guardian (Advanced level)</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  ✍️ Writing
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Cambridge Write & Improve</li>
                  <li>• Journal writing</li>
                  <li>• IELTS writing samples</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  🗣️ Speaking
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• AI Conversation Partners</li>
                  <li>• IELTS Speaking Practice</li>
                  <li>• Voice recordings</li>
                  <li>• HelloTalk, Italki</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  🎯 IELTS
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Magoosh IELTS</li>
                  <li>• Official IELTS Materials</li>
                  <li>• EF SET Level Test</li>
                  <li>• IELTS Liz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Multi-Platform Access Info */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-700">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">
                📱💻 Multi-Platform Access Active!
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 text-green-700 dark:text-green-400">
                  <h4 className="font-bold">✅ What&apos;s Working:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Real-time cloud sync with Firebase</li>
                    <li>• Access from any device with this URL</li>
                    <li>• Automatic data backup</li>
                    <li>• Progress syncs across devices</li>
                    <li>• Works offline, syncs when online</li>
                  </ul>
                </div>

                <div className="space-y-3 text-green-700 dark:text-green-400">
                  <h4 className="font-bold">🚀 URL Access:</h4>
                  <div className="bg-white dark:bg-gray-800 rounded p-3">
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-300">
                      https://language-learning-trracker.vercel.app
                    </p>
                  </div>
                  <p className="text-xs">
                    Bookmark this URL on all your devices (phone, tablet, PC)
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                  💡 How to Use:
                </h4>
                <ol className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>1. Open URL on any device</li>
                  <li>2. Mark tasks as complete using checkboxes</li>
                  <li>3. Click &quot;☁️ Cloud Sync&quot; to save to cloud</li>
                  <li>4. Changes appear on all your devices!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

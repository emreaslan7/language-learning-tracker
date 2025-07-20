"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getWeekData } from "../../../data/language-learning";
import { DayActivity } from "../../../data/language-learning/types";
import { ProgressTracker } from "../../../data/language-learning/progressTracker";
import {
  VocabularyManager,
  vocabularyStats,
} from "../../../data/language-learning/vocabulary";

// Daily Vocabulary Card Component
const DailyVocabularyCard = ({
  weekNumber,
  dayNumber,
  onWordsLearned,
}: {
  weekNumber: number;
  dayNumber: number;
  onWordsLearned: (count: number) => void;
}) => {
  const [dailyWords, setDailyWords] = useState<any[]>([]);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [editableDefinition, setEditableDefinition] = useState("");
  const [editableExamples, setEditableExamples] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const wordsPerDay = Math.floor(vocabularyStats.totalWords / 365);

  // Check if we're on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Get words for this specific day using the new system
    const dayWords = VocabularyManager.getWeekDayWords(weekNumber, dayNumber);
    setDailyWords(dayWords);

    // Check how many words are already learned
    const learned = dayWords.filter((word: any) => word.learned).length;
    setWordsLearned(learned);

    // Call onWordsLearned only when the component mounts or when weekNumber/dayNumber changes
    onWordsLearned(learned);
  }, [weekNumber, dayNumber, isClient]); // Add isClient to dependencies

  const handleStartStudy = () => {
    setIsStudying(true);
    // Redirect to vocabulary study page
    window.location.href = "/language-learning/vocabulary-study";
  };

  const handleWordLearned = (wordId: string) => {
    VocabularyManager.markAsLearned(wordId);
    const newCount = wordsLearned + 1;
    setWordsLearned(newCount);
    onWordsLearned(newCount);
  };

  const handleWordClick = (word: any) => {
    if (!isClient) return;

    setSelectedWord(word);
    setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
    setIsCardFlipped(false);
    setEditableDefinition("");
    setEditableExamples([""]);
  };

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
    if (!isClient || !selectedWord) return;

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
    if (status === "learned") {
      VocabularyManager.markAsLearned(selectedWord.id);
      const newCount = wordsLearned + 1;
      setWordsLearned(newCount);
      onWordsLearned(newCount);

      // Update the word in the daily words array
      setDailyWords((prevWords) =>
        prevWords.map((word) =>
          word.id === selectedWord.id
            ? { ...word, learned: true, confused: false }
            : word
        )
      );
    } else if (status === "confused") {
      VocabularyManager.markAsIncorrect(selectedWord.id);

      // Update the word in the daily words array
      setDailyWords((prevWords) =>
        prevWords.map((word) =>
          word.id === selectedWord.id
            ? { ...word, confused: true, learned: false }
            : word
        )
      );
    } else if (status === "not-learned") {
      // Reset the word status
      setDailyWords((prevWords) =>
        prevWords.map((word) =>
          word.id === selectedWord.id
            ? { ...word, learned: false, confused: false }
            : word
        )
      );
    }

    closeModal();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Daily Vocabulary
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {wordsLearned}/{wordsPerDay}
          </span>
          <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(wordsLearned / wordsPerDay) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Learn {wordsPerDay} new words today to stay on track with your 365-day
          vocabulary goal.
        </div>

        {dailyWords.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Today's Words:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {dailyWords.map((word, index) => (
                <div
                  key={word.id}
                  className={`p-2 rounded cursor-pointer transition-colors hover:opacity-80 ${
                    word.learned
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : word.confused
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                  }`}
                  onClick={() => handleWordClick(word)}
                >
                  <span className="font-medium">{word.word}</span>
                  {word.learned && <span className="ml-1">✓</span>}
                  {word.confused && <span className="ml-1">?</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleStartStudy}
          disabled={wordsLearned >= wordsPerDay}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            wordsLearned >= wordsPerDay
              ? "bg-green-100 text-green-800 cursor-not-allowed dark:bg-green-900/20 dark:text-green-300"
              : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          }`}
        >
          {wordsLearned >= wordsPerDay
            ? "Daily Goal Completed!"
            : "Start Vocabulary Study"}
        </button>
      </div>

      {/* Word Modal */}
      {isModalOpen && selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            {/* Close button */}
            <button
              onClick={closeModal}
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
    </div>
  );
};

// Task Completion Button Component
const TaskCompletionButton = ({
  weekNumber,
  dayNumber,
  taskType,
  taskName,
  isCompleted,
  onToggle,
}: {
  weekNumber: number;
  dayNumber: number;
  taskType: string;
  taskName: string;
  isCompleted: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-3 rounded-lg border transition-all duration-200 ${
        isCompleted
          ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
              isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            {isCompleted && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="font-medium">{taskName}</span>
        </div>
        <span className="text-sm">
          {isCompleted ? "Completed" : "Complete"}
        </span>
      </div>
    </button>
  );
};

export default function WeekDetail() {
  const params = useParams();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);
  const [taskCompletions, setTaskCompletions] = useState<{
    [key: string]: boolean;
  }>({});
  const [vocabularyProgress, setVocabularyProgress] = useState<{
    [key: string]: number;
  }>({});
  const [dayCompletionPercentages, setDayCompletionPercentages] = useState<{
    [key: number]: number;
  }>({});
  const [isClient, setIsClient] = useState(false);

  // "week-1" formatından sadece sayıyı çıkar
  const weekString = params.week as string;
  const weekNumber = parseInt(weekString.replace("week-", ""));
  const weekData = getWeekData(weekNumber);

  // Check if we're on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Vocabulary progress handler
  const handleVocabularyProgress = (day: number, wordsLearned: number) => {
    const key = `${weekNumber}-${day}`;
    setVocabularyProgress((prev) => ({
      ...prev,
      [key]: wordsLearned,
    }));
  };

  // Task completion durumlarını yükle
  useEffect(() => {
    if (!isClient) return;

    const loadCompletions = () => {
      const completions: { [key: string]: boolean } = {};
      const percentages: { [key: number]: number } = {};

      for (let day = 1; day <= 7; day++) {
        const tasks = ["warmUp", "mainFocus", "practice", "review"];
        // Writing günlerini kontrol et
        const writingDays = [1, 2, 4, 6];
        if (writingDays.includes(day)) {
          tasks.push("writing");
        }

        tasks.forEach((task) => {
          const key = `${weekNumber}-${day}-${task}`;
          completions[key] = ProgressTracker.isTaskCompleted(
            weekNumber,
            day,
            task
          );
        });

        // Calculate completion percentage for each day
        percentages[day] = ProgressTracker.getDayCompletionPercentage(
          weekNumber,
          day
        );
      }

      setTaskCompletions(completions);
      setDayCompletionPercentages(percentages);
    };

    loadCompletions();
  }, [weekNumber, isClient]);

  // Task completion toggle handler
  const toggleTaskCompletion = (dayNumber: number, taskType: string) => {
    const key = `${weekNumber}-${dayNumber}-${taskType}`;
    const currentStatus = taskCompletions[key];

    if (currentStatus) {
      ProgressTracker.uncompleteTask(weekNumber, dayNumber, taskType);
    } else {
      ProgressTracker.completeTask(weekNumber, dayNumber, taskType);
    }

    setTaskCompletions((prev) => ({
      ...prev,
      [key]: !currentStatus,
    }));

    // Update day completion percentage
    const newPercentage = ProgressTracker.getDayCompletionPercentage(
      weekNumber,
      dayNumber
    );
    setDayCompletionPercentages((prev) => ({
      ...prev,
      [dayNumber]: newPercentage,
    }));
  };

  // Günün tamamlanma yüzdesini hesapla
  const getDayCompletionPercentage = (dayNumber: number) => {
    return dayCompletionPercentages[dayNumber] || 0;
  };

  if (!weekData) {
    return <div>Week not found</div>;
  }

  const selectedDayData = weekData.days.find((day) => day.day === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/language-learning"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Weekly Plan
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Week {weekNumber}: {weekData.title}
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {weekData.focus}
          </div>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {weekData.phase}
            </span>
          </div>
        </div>

        {/* Week Overview */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Weekly Daily Plan
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weekData.days.map((day) => {
              const completionPercentage = isClient
                ? getDayCompletionPercentage(day.day)
                : 0;
              return (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedDay === day.day
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-2 ${
                        selectedDay === day.day
                          ? "text-green-600"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {day.day}
                    </div>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        selectedDay === day.day
                          ? "text-green-700"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {day.dayName}
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          completionPercentage === 100
                            ? "bg-green-500"
                            : completionPercentage > 75
                            ? "bg-green-400"
                            : completionPercentage > 50
                            ? "bg-yellow-400"
                            : completionPercentage > 25
                            ? "bg-orange-400"
                            : completionPercentage > 0
                            ? "bg-red-400"
                            : "bg-gray-300"
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {completionPercentage}%
                    </div>

                    <div
                      className={`text-xs ${
                        selectedDay === day.day
                          ? "text-green-600"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {day.focus}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detail */}
        {selectedDayData && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Day {selectedDayData.day} - {selectedDayData.dayName}
                </h3>
                <div className="text-lg text-green-600 dark:text-green-400 font-semibold">
                  {selectedDayData.focus}
                </div>
              </div>

              {/* Task Completion & Time Breakdown */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Daily Tasks
                  </h4>
                  <div className="space-y-3">
                    {/* Ana görevler */}
                    <TaskCompletionButton
                      weekNumber={weekNumber}
                      dayNumber={selectedDay}
                      taskType="warmUp"
                      taskName="Previous Day Review"
                      isCompleted={
                        taskCompletions[
                          `${weekNumber}-${selectedDay}-warmUp`
                        ] || false
                      }
                      onToggle={() =>
                        toggleTaskCompletion(selectedDay, "warmUp")
                      }
                    />

                    <TaskCompletionButton
                      weekNumber={weekNumber}
                      dayNumber={selectedDay}
                      taskType="mainFocus"
                      taskName="Main Topic Study"
                      isCompleted={
                        taskCompletions[
                          `${weekNumber}-${selectedDay}-mainFocus`
                        ] || false
                      }
                      onToggle={() =>
                        toggleTaskCompletion(selectedDay, "mainFocus")
                      }
                    />

                    {/* Daily Vocabulary Learning */}
                    <DailyVocabularyCard
                      weekNumber={weekNumber}
                      dayNumber={selectedDay}
                      onWordsLearned={(count) =>
                        handleVocabularyProgress(selectedDay, count)
                      }
                    />

                    <TaskCompletionButton
                      weekNumber={weekNumber}
                      dayNumber={selectedDay}
                      taskType="practice"
                      taskName="AI English Practice"
                      isCompleted={
                        taskCompletions[
                          `${weekNumber}-${selectedDay}-practice`
                        ] || false
                      }
                      onToggle={() =>
                        toggleTaskCompletion(selectedDay, "practice")
                      }
                    />

                    {/* Writing task (only on specific days) */}
                    {[1, 2, 4, 6].includes(selectedDay) && (
                      <TaskCompletionButton
                        weekNumber={weekNumber}
                        dayNumber={selectedDay}
                        taskType="writing"
                        taskName={`Writing: ${
                          selectedDay === 1
                            ? "Comprehensive Essay"
                            : "Daily Notes"
                        }`}
                        isCompleted={
                          taskCompletions[
                            `${weekNumber}-${selectedDay}-writing`
                          ] || false
                        }
                        onToggle={() =>
                          toggleTaskCompletion(selectedDay, "writing")
                        }
                      />
                    )}

                    <TaskCompletionButton
                      weekNumber={weekNumber}
                      dayNumber={selectedDay}
                      taskType="review"
                      taskName="New Words & Evaluation"
                      isCompleted={
                        taskCompletions[
                          `${weekNumber}-${selectedDay}-review`
                        ] || false
                      }
                      onToggle={() =>
                        toggleTaskCompletion(selectedDay, "review")
                      }
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Time Distribution
                  </h4>
                  <div className="space-y-3">
                    {selectedDayData.timeBreakdown.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.activity}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-semibold">
                          {item.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Recommended Resources
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedDayData.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-blue-700 dark:text-blue-300">
                        {resource}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Progress Summary */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Daily Progress Summary
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-800 dark:text-green-300 font-medium">
                        Daily Activities
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {Math.round(
                          isClient ? getDayCompletionPercentage(selectedDay) : 0
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            isClient
                              ? getDayCompletionPercentage(selectedDay)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-800 dark:text-purple-300 font-medium">
                        Vocabulary Progress
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {vocabularyProgress[`${weekNumber}-${selectedDay}`] ||
                          0}{" "}
                        / {Math.round(vocabularyStats.totalWords / 365)}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((vocabularyProgress[
                              `${weekNumber}-${selectedDay}`
                            ] || 0) /
                              Math.round(vocabularyStats.totalWords / 365)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Activities */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h5 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Warm-up (10min)
                  </h5>
                  <div className="text-blue-700 dark:text-blue-400 text-sm">
                    {selectedDayData.activities.warmUp}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h5 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Main Focus (30-40min)
                  </h5>
                  <div className="text-green-700 dark:text-green-400 text-sm">
                    {selectedDayData.activities.mainFocus}
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h5 className="font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Practice (20-30min)
                  </h5>
                  <div className="text-purple-700 dark:text-purple-400 text-sm">
                    {selectedDayData.activities.practice}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                  <h5 className="font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Review (5-10min)
                  </h5>
                  <div className="text-orange-700 dark:text-orange-400 text-sm">
                    {selectedDayData.activities.review}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay === 1}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous Day
              </button>

              <div className="text-gray-600 dark:text-gray-300">
                {selectedDay} / 7
              </div>

              <button
                onClick={() => setSelectedDay(Math.min(7, selectedDay + 1))}
                disabled={selectedDay === 7}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Day
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

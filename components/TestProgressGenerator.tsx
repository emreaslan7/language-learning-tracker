// Test progress data generator
import {
  TaskProgress,
  TaskType,
} from "../data/language-learning/progressTracker";

export class TestProgressGenerator {
  static generateRandomProgress(): void {
    const weeks = [1, 2, 3, 4, 5, 6];
    const days = [1, 2, 3, 4, 5, 6, 7];
    const tasks: TaskType[] = ["warmUp", "mainFocus", "practice", "review"];

    const progress: TaskProgress[] = [];

    weeks.forEach((week) => {
      days.forEach((day) => {
        tasks.forEach((task) => {
          // %70 ihtimalle tamamlanmış göster
          const completed = Math.random() > 0.3;

          if (completed) {
            progress.push({
              weekNumber: week,
              dayNumber: day,
              taskType: task,
              completed: true,
              completedAt: new Date(),
            });
          }
        });

        // Writing görevleri sadece belirli günlerde (1,2,4,6)
        if ([1, 2, 4, 6].includes(day)) {
          const writingCompleted = Math.random() > 0.4;
          if (writingCompleted) {
            progress.push({
              weekNumber: week,
              dayNumber: day,
              taskType: "writing",
              completed: true,
              completedAt: new Date(),
            });
          }
        }
      });
    });

    localStorage.setItem(
      "language-learning-progress",
      JSON.stringify(progress)
    );
    console.log("✅ Test progress data generated:", progress.length, "records");
  }

  static clearAllProgress(): void {
    localStorage.removeItem("language-learning-progress");
    console.log("🗑️ All progress data cleared");
  }
}

// Global olarak erişim için
declare global {
  interface Window {
    TestProgressGenerator: typeof TestProgressGenerator;
  }
}

if (typeof window !== "undefined") {
  window.TestProgressGenerator = TestProgressGenerator;
}

// Progress tracking için localStorage tabanlı sistem
export type TaskType =
  | "warmUp"
  | "mainFocus"
  | "practice"
  | "review"
  | "writing";

export interface TaskProgress {
  weekNumber: number;
  dayNumber: number;
  taskType: TaskType;
  completed: boolean;
  completedAt?: Date;
}

export interface DayProgress {
  weekNumber: number;
  dayNumber: number;
  tasks: TaskProgress[];
  completionPercentage: number;
}

export class ProgressTracker {
  private static STORAGE_KEY = "language-learning-progress";

  // Tüm progress verilerini al
  static getAllProgress(): TaskProgress[] {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Cloud sync init (sayfa yüklendiğinde çağırın)
  static async initCloudSync(): Promise<void> {
    try {
      const { CloudProgressTracker } = await import("./cloudProgressTracker");
      await CloudProgressTracker.syncData();
    } catch (error) {
      console.warn(
        "Cloud sync mevcut değil, sadece localStorage kullanılacak:",
        error
      );
    }
  }

  // Progress verisini export et
  static async exportProgress(): Promise<string> {
    try {
      const { CloudProgressTracker } = await import("./cloudProgressTracker");
      return await CloudProgressTracker.exportData();
    } catch (error) {
      console.warn(
        "Cloud export mevcut değil, localStorage export yapılıyor:",
        error
      );
      const data = this.getAllProgress();
      return JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          version: "1.0",
          progressData: data,
        },
        null,
        2
      );
    }
  }

  // Progress verisini import et
  static async importProgress(jsonData: string): Promise<boolean> {
    try {
      const { CloudProgressTracker } = await import("./cloudProgressTracker");
      return await CloudProgressTracker.importData(jsonData);
    } catch (error) {
      console.warn(
        "Cloud import mevcut değil, localStorage import yapılıyor:",
        error
      );
      try {
        const importedData = JSON.parse(jsonData);
        if (
          importedData.progressData &&
          Array.isArray(importedData.progressData)
        ) {
          localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(importedData.progressData)
          );
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }
  }

  // Belirli bir görevi tamamla
  static async completeTask(
    weekNumber: number,
    dayNumber: number,
    taskType: TaskType
  ): Promise<void> {
    const progress = this.getAllProgress();

    // Mevcut görevi bul
    const existingIndex = progress.findIndex(
      (p) =>
        p.weekNumber === weekNumber &&
        p.dayNumber === dayNumber &&
        p.taskType === taskType
    );

    const taskProgress: TaskProgress = {
      weekNumber,
      dayNumber,
      taskType,
      completed: true,
      completedAt: new Date(),
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = taskProgress;
    } else {
      progress.push(taskProgress);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));

    // UI'ı güncelle
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("localStorageChanged"));
    }

    // Cloud sync (async)
    try {
      const { CloudProgressTracker } = await import("./cloudProgressTracker");
      CloudProgressTracker.autoSync(taskProgress);
    } catch (error) {
      console.warn("Cloud sync mevcut değil:", error);
    }
  }

  // Görevi tamamlanmamış olarak işaretle
  static async uncompleteTask(
    weekNumber: number,
    dayNumber: number,
    taskType: TaskType
  ): Promise<void> {
    const progress = this.getAllProgress();

    const existingIndex = progress.findIndex(
      (p) =>
        p.weekNumber === weekNumber &&
        p.dayNumber === dayNumber &&
        p.taskType === taskType
    );

    const taskProgress: TaskProgress = {
      weekNumber,
      dayNumber,
      taskType,
      completed: false,
      completedAt: undefined,
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = taskProgress;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));

    // UI'ı güncelle
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("localStorageChanged"));
    }

    // Cloud sync (async)
    try {
      const { CloudProgressTracker } = await import("./cloudProgressTracker");
      CloudProgressTracker.autoSync(taskProgress);
    } catch (error) {
      console.warn("Cloud sync mevcut değil:", error);
    }
  }

  // Belirli bir görevin tamamlanma durumunu kontrol et
  static isTaskCompleted(
    weekNumber: number,
    dayNumber: number,
    taskType: TaskType
  ): boolean {
    const progress = this.getAllProgress();
    const task = progress.find(
      (p) =>
        p.weekNumber === weekNumber &&
        p.dayNumber === dayNumber &&
        p.taskType === taskType
    );

    return task ? task.completed : false;
  }

  // Bir günün tamamlanma yüzdesini hesapla
  static getDayCompletionPercentage(
    weekNumber: number,
    dayNumber: number
  ): number {
    const allTasks: TaskType[] = ["warmUp", "mainFocus", "practice", "review"];

    // Writing günlerini kontrol et (Pazartesi=1, Salı=2, Perşembe=4, Cumartesi=6)
    const writingDays = [1, 2, 4, 6];
    if (writingDays.includes(dayNumber)) {
      allTasks.push("writing");
    }

    const completedTasks = allTasks.filter((task) =>
      this.isTaskCompleted(weekNumber, dayNumber, task)
    ).length;

    return Math.round((completedTasks / allTasks.length) * 100);
  }

  // 365 günlük progress verilerini al (GitHub contributions benzeri)
  static getYearlyProgress(): DayProgress[] {
    const yearlyProgress: DayProgress[] = [];

    for (let week = 1; week <= 52; week++) {
      for (let day = 1; day <= 7; day++) {
        const completionPercentage = this.getDayCompletionPercentage(week, day);

        yearlyProgress.push({
          weekNumber: week,
          dayNumber: day,
          tasks: this.getAllProgress().filter(
            (p) => p.weekNumber === week && p.dayNumber === day
          ),
          completionPercentage,
        });
      }
    }

    return yearlyProgress;
  }

  // Yeşil ton hesaplama (GitHub contributions benzeri)
  static getCompletionColor(percentage: number): string {
    if (percentage === 0) return "bg-gray-100 dark:bg-gray-800"; // Hiç yapılmamış
    if (percentage <= 25) return "bg-green-100 dark:bg-green-700"; // %25 ve altı
    if (percentage <= 50) return "bg-green-200 dark:bg-green-600"; // %50 ve altı
    if (percentage <= 75) return "bg-green-300 dark:bg-green-500"; // %75 ve altı
    return "bg-green-400 dark:bg-green-400"; // %100 tamamlanmış
  }

  // Haftalık progress özeti
  static getWeeklyProgress(weekNumber: number): DayProgress[] {
    const weeklyProgress: DayProgress[] = [];

    for (let day = 1; day <= 7; day++) {
      const completionPercentage = this.getDayCompletionPercentage(
        weekNumber,
        day
      );

      weeklyProgress.push({
        weekNumber,
        dayNumber: day,
        tasks: this.getAllProgress().filter(
          (p) => p.weekNumber === weekNumber && p.dayNumber === day
        ),
        completionPercentage,
      });
    }

    return weeklyProgress;
  }

  // Toplam progress istatistikleri
  static getOverallStats() {
    const yearlyProgress = this.getYearlyProgress();
    const totalDays = yearlyProgress.length;
    const completedDays = yearlyProgress.filter(
      (day) => day.completionPercentage === 100
    ).length;
    const partialDays = yearlyProgress.filter(
      (day) => day.completionPercentage > 0 && day.completionPercentage < 100
    ).length;

    // Güncel seri hesaplama
    const currentStreak = this.getCurrentStreak();

    // Maksimum seri hesaplama
    const maxStreak = this.getMaxStreak();

    // Haftalık plan progress hesaplama
    const weeklyPlanProgress = this.getWeeklyPlanProgress();

    return {
      totalDays,
      completedDays,
      partialDays,
      uncompletedDays: totalDays - completedDays - partialDays,
      overallPercentage: Math.round((completedDays / totalDays) * 100),
      currentStreak,
      maxStreak,
      weeklyPlanProgress,
    };
  }

  // Güncel seri hesaplama (son tamamlanan günlerden kaç tane ardışık)
  static getCurrentStreak(): number {
    const yearlyProgress = this.getYearlyProgress();
    let streak = 0;

    // Son aktivite olan günü bul (0%'dan büyük)
    let lastActiveDayIndex = -1;
    for (let i = yearlyProgress.length - 1; i >= 0; i--) {
      if (yearlyProgress[i].completionPercentage > 0) {
        lastActiveDayIndex = i;
        break;
      }
    }

    // Eğer hiç aktivite yoksa streak = 0
    if (lastActiveDayIndex === -1) {
      return 0;
    }

    // Son aktif günden geriye doğru ardışık aktif günleri say
    for (let i = lastActiveDayIndex; i >= 0; i--) {
      if (yearlyProgress[i].completionPercentage > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Maksimum seri hesaplama
  static getMaxStreak(): number {
    const yearlyProgress = this.getYearlyProgress();
    let maxStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < yearlyProgress.length; i++) {
      if (yearlyProgress[i].completionPercentage > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  // Haftalık plan progress hesaplama
  static getWeeklyPlanProgress(): number {
    const yearlyProgress = this.getYearlyProgress();
    const completedWeeks = new Set<number>();

    // Her hafta için tamamlanma durumunu kontrol et
    for (let week = 1; week <= 52; week++) {
      const weekDays = yearlyProgress.filter((day) => day.weekNumber === week);
      const completedDaysInWeek = weekDays.filter(
        (day) => day.completionPercentage === 100
      ).length;

      // Haftanın en az %70'i tamamlandıysa hafta tamamlanmış sayılır
      if (completedDaysInWeek >= 5) {
        // 7 günün 5'i tamamlandıysa
        completedWeeks.add(week);
      }
    }

    return Math.round((completedWeeks.size / 52) * 100);
  }

  // Aktif hafta belirleme (son tamamlanan günün bir sonraki haftası)
  static getCurrentActiveWeek(): number {
    const yearlyProgress = this.getYearlyProgress();

    // Son tamamlanan veya kısmen tamamlanan günü bul
    let lastActiveDay = null;
    let lastActiveDayIndex = -1;

    for (let i = yearlyProgress.length - 1; i >= 0; i--) {
      if (yearlyProgress[i].completionPercentage > 0) {
        lastActiveDay = yearlyProgress[i];
        lastActiveDayIndex = i;
        break;
      }
    }

    if (lastActiveDay) {
      // Son aktif günün bir sonraki günü hesapla
      const nextDayIndex = lastActiveDayIndex + 1;

      // Eğer yıl sonu değilse, bir sonraki günün haftasını döndür
      if (nextDayIndex < yearlyProgress.length) {
        return yearlyProgress[nextDayIndex].weekNumber;
      }

      // Yıl sonundaysa son haftayı döndür
      return 52;
    }

    // Hiç aktivite yoksa 1. haftayı döndür
    return 1;
  }
}

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { TaskProgress } from "./progressTracker";

export class CloudProgressTracker {
  private static COLLECTION_NAME = "progress_data";

  // User ID al (localStorage'dan unique ID)
  private static getUserId(): string {
    // localStorage'dan unique ID al veya oluştur
    let userId = localStorage.getItem("unique_user_id");
    if (!userId) {
      userId =
        "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("unique_user_id", userId);
    }
    return userId;
  }

  // Progress verilerini Firebase'e kaydet
  static async saveProgressToCloud(progress: TaskProgress[]): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const docRef = doc(db, this.COLLECTION_NAME, userId);

      await setDoc(docRef, {
        userId,
        progress,
        lastUpdated: new Date(),
        version: 1,
      });

      console.log("✅ Progress veriler Firebase'e kaydedildi");
      return true;
    } catch (error) {
      console.error("❌ Firebase kayıt hatası:", error);
      return false;
    }
  }

  // Progress verilerini Firebase'den al
  static async loadProgressFromCloud(): Promise<TaskProgress[]> {
    try {
      const userId = this.getUserId();
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("✅ Progress veriler Firebase'den yüklendi");
        return data.progress || [];
      } else {
        console.log("📝 Firebase'de veri bulunamadı");
        return [];
      }
    } catch (error) {
      console.error("❌ Firebase yükleme hatası:", error);
      return [];
    }
  }

  // LocalStorage ve Firebase'i senkronize et
  static async syncData(): Promise<{
    success: boolean;
    source: "local" | "cloud" | "merged";
    conflictResolved?: boolean;
  }> {
    try {
      // localStorage'dan verileri al
      const localData = JSON.parse(
        localStorage.getItem("language-learning-progress") || "[]"
      );

      // Firebase'den verileri al
      const cloudData = await this.loadProgressFromCloud();

      if (localData.length === 0 && cloudData.length === 0) {
        return { success: true, source: "local" };
      }

      if (localData.length === 0 && cloudData.length > 0) {
        // Sadece cloud'da veri var, local'e kopyala
        localStorage.setItem(
          "language-learning-progress",
          JSON.stringify(cloudData)
        );
        return { success: true, source: "cloud" };
      }

      if (localData.length > 0 && cloudData.length === 0) {
        // Sadece local'de veri var, cloud'a yükle
        await this.saveProgressToCloud(localData);
        return { success: true, source: "local" };
      }

      // Her ikisinde de veri var, merge et
      const mergedData = this.mergeProgressData(localData, cloudData);

      // Merge edilen veriyi her iki yere de kaydet
      localStorage.setItem(
        "language-learning-progress",
        JSON.stringify(mergedData)
      );
      await this.saveProgressToCloud(mergedData);

      return {
        success: true,
        source: "merged",
        conflictResolved:
          mergedData.length !== localData.length ||
          mergedData.length !== cloudData.length,
      };
    } catch (error) {
      console.error("❌ Sync hatası:", error);
      return { success: false, source: "local" };
    }
  }

  // İki progress array'ini merge et (en son güncelleneni öncelikle)
  private static mergeProgressData(
    local: TaskProgress[],
    cloud: TaskProgress[]
  ): TaskProgress[] {
    const merged = new Map<string, TaskProgress>();

    // Cloud verilerini ekle
    cloud.forEach((item) => {
      const key = `${item.weekNumber}-${item.dayNumber}-${item.taskType}`;
      merged.set(key, item);
    });

    // Local verileri ekle (var olanları güncelle)
    local.forEach((item) => {
      const key = `${item.weekNumber}-${item.dayNumber}-${item.taskType}`;
      const existing = merged.get(key);

      if (!existing) {
        merged.set(key, item);
      } else {
        // En son güncellenenyi al
        const existingDate = existing.completedAt
          ? new Date(existing.completedAt)
          : new Date(0);
        const currentDate = item.completedAt
          ? new Date(item.completedAt)
          : new Date(0);

        if (currentDate >= existingDate) {
          merged.set(key, item);
        }
      }
    });

    return Array.from(merged.values());
  }

  // Otomatik senkronizasyon (her değişiklikten sonra)
  static async autoSync(taskProgress: TaskProgress): Promise<void> {
    try {
      console.log("🔄 AutoSync başlatılıyor:", taskProgress);

      // Önce localStorage'a kaydet
      const currentData = JSON.parse(
        localStorage.getItem("language-learning-progress") || "[]"
      );

      const existingIndex = currentData.findIndex(
        (p: TaskProgress) =>
          p.weekNumber === taskProgress.weekNumber &&
          p.dayNumber === taskProgress.dayNumber &&
          p.taskType === taskProgress.taskType
      );

      if (existingIndex >= 0) {
        currentData[existingIndex] = taskProgress;
        console.log("📝 Mevcut kayıt güncellendi");
      } else {
        currentData.push(taskProgress);
        console.log("➕ Yeni kayıt eklendi");
      }

      localStorage.setItem(
        "language-learning-progress",
        JSON.stringify(currentData)
      );
      console.log("💾 localStorage güncellendi");

      // Firebase'e hemen kaydet (delay kaldırıldı)
      console.log("☁️ Firebase sync başlatılıyor...");
      await this.saveProgressToCloud(currentData);
      console.log("✅ AutoSync tamamlandı");
    } catch (error) {
      console.error("❌ Auto sync hatası:", error);
      // Hata durumunda bile localStorage kaydını koru
      throw error; // Hatayı yukarı fırlat ki UI'da gösterilebilsin
    }
  }

  // Veri yedekleme (JSON export)
  static async exportData(): Promise<string> {
    try {
      await this.syncData(); // Önce sync yap
      const data = JSON.parse(
        localStorage.getItem("language-learning-progress") || "[]"
      );

      const exportData = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        userId: this.getUserId(),
        progressData: data,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("❌ Export hatası:", error);
      return "{}";
    }
  }

  // Veri import (JSON import)
  static async importData(jsonData: string): Promise<boolean> {
    try {
      const importedData = JSON.parse(jsonData);

      if (
        !importedData.progressData ||
        !Array.isArray(importedData.progressData)
      ) {
        throw new Error("Geçersiz data formatı");
      }

      // Mevcut verilerle merge et
      const currentData = JSON.parse(
        localStorage.getItem("language-learning-progress") || "[]"
      );
      const mergedData = this.mergeProgressData(
        currentData,
        importedData.progressData
      );

      // Kaydet
      localStorage.setItem(
        "language-learning-progress",
        JSON.stringify(mergedData)
      );
      await this.saveProgressToCloud(mergedData);

      console.log("✅ Data başarıyla import edildi");
      return true;
    } catch (error) {
      console.error("❌ Import hatası:", error);
      return false;
    }
  }
}

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// Vocabulary progress interface
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

// User custom data interface
interface UserWordData {
  definition?: string;
  examples?: string[];
}

// Firebase için temizlenmiş progress data
interface CleanedWordProgress {
  wordId: string;
  learned: boolean;
  confused: boolean;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewDate: string | null;
  nextReviewDate: string | null;
  difficulty: number;
}

export class CloudVocabularyTracker {
  private static COLLECTION_NAME = "vocabulary_data";
  private static PROGRESS_DOC = "main_vocabulary_progress";
  private static USER_DATA_DOC = "main_vocabulary_userdata";

  // Firebase'den veri çek ve localStorage'a yaz
  static async loadAndSyncFromFirebase(): Promise<{
    progressLoaded: boolean;
    userDataLoaded: boolean;
  }> {
    try {
      // Progress verisi çek ve localStorage'a yaz
      const progressData = await this.loadProgressFromCloud();
      if (Object.keys(progressData).length > 0) {
        localStorage.setItem(
          "vocabulary-progress",
          JSON.stringify(progressData)
        );

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
        }
      }

      // User data çek ve localStorage'a yaz
      const userData = await this.loadUserDataFromCloud();
      if (Object.keys(userData).length > 0) {
        localStorage.setItem("vocabulary-user-data", JSON.stringify(userData));

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
        }
      }

      return {
        progressLoaded: Object.keys(progressData).length > 0,
        userDataLoaded: Object.keys(userData).length > 0,
      };
    } catch (error) {
      console.error("❌ Firebase'den veri çekme hatası:", error);
      return { progressLoaded: false, userDataLoaded: false };
    }
  }

  // localStorage'dan Firebase'e progress kaydet
  static async saveProgressToCloud(progressData: {
    [key: string]: WordProgress;
  }): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.PROGRESS_DOC);

      // Firebase için undefined ve Date değerleri null'a çevir
      const cleanedProgress = Object.keys(progressData).reduce((acc, key) => {
        const item = progressData[key];
        acc[key] = {
          ...item,
          lastReviewDate: item.lastReviewDate
            ? item.lastReviewDate instanceof Date
              ? item.lastReviewDate.toISOString()
              : item.lastReviewDate
            : null,
          nextReviewDate: item.nextReviewDate
            ? item.nextReviewDate instanceof Date
              ? item.nextReviewDate.toISOString()
              : item.nextReviewDate
            : null,
        };
        return acc;
      }, {} as Record<string, CleanedWordProgress>);

      // progress field'ını merge et (user data sistemi gibi)
      await setDoc(
        docRef,
        {
          progress: cleanedProgress,
          lastUpdated: new Date(),
          version: 1,
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error("❌ Firebase progress kayıt hatası:", error);
      return false;
    }
  }

  // localStorage'dan Firebase'e user data kaydet
  static async saveUserDataToCloud(userData: {
    [key: string]: UserWordData;
  }): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.USER_DATA_DOC);

      await setDoc(
        docRef,
        {
          userData,
          lastUpdated: new Date(),
          version: 1,
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error("❌ Firebase vocabulary user data kayıt hatası:", error);
      return false;
    }
  }

  // Vocabulary progress'i Firebase'den al
  static async loadProgressFromCloud(): Promise<{
    [key: string]: WordProgress;
  }> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.PROGRESS_DOC);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const rawProgress = data.progress || {};

        // String tarihlerini Date'e çevir
        const convertedProgress: { [key: string]: WordProgress } = {};
        Object.keys(rawProgress).forEach((wordId) => {
          const item = rawProgress[wordId];
          convertedProgress[wordId] = {
            ...item,
            lastReviewDate: item.lastReviewDate
              ? new Date(item.lastReviewDate)
              : new Date(),
            nextReviewDate: item.nextReviewDate
              ? new Date(item.nextReviewDate)
              : new Date(),
          };
        });

        return convertedProgress;
      } else {
        return {};
      }
    } catch (error) {
      console.error("❌ Firebase vocabulary progress yükleme hatası:", error);
      return {};
    }
  }

  // User data'yı Firebase'den al
  static async loadUserDataFromCloud(): Promise<{
    [key: string]: UserWordData;
  }> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.USER_DATA_DOC);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.userData || {};
      } else {
        return {};
      }
    } catch (error) {
      console.error("❌ Firebase vocabulary user data yükleme hatası:", error);
      return {};
    }
  }

  // Vocabulary progress senkronizasyonu
  static async syncProgressData(): Promise<{
    success: boolean;
    source: string;
  }> {
    try {
      // Cloud'dan progress al
      const cloudData = await this.loadProgressFromCloud();

      // Local'deki progress'i al
      const localDataStr = localStorage.getItem("vocabulary-progress");
      const localData = localDataStr ? JSON.parse(localDataStr) : {};

      if (
        Object.keys(cloudData).length === 0 &&
        Object.keys(localData).length === 0
      ) {
        return { success: true, source: "empty" };
      }

      if (
        Object.keys(cloudData).length > 0 &&
        Object.keys(localData).length === 0
      ) {
        // Sadece cloud'da veri var, local'e koy
        localStorage.setItem("vocabulary-progress", JSON.stringify(cloudData));

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
        }

        return { success: true, source: "cloud" };
      }

      if (
        Object.keys(localData).length > 0 &&
        Object.keys(cloudData).length === 0
      ) {
        // Sadece local'de veri var, cloud'a yükle
        await this.saveProgressToCloud(localData);
        return { success: true, source: "local" };
      }

      // Her ikisinde de veri var, merge et
      const mergedData = this.mergeProgressData(localData, cloudData);

      // Merge edilen veriyi her iki yere de kaydet
      localStorage.setItem("vocabulary-progress", JSON.stringify(mergedData));
      await this.saveProgressToCloud(mergedData);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      }

      return { success: true, source: "merged" };
    } catch (error) {
      console.error("❌ Vocabulary progress sync hatası:", error);
      return { success: false, source: "local" };
    }
  }

  // User data senkronizasyonu
  static async syncUserData(): Promise<{ success: boolean; source: string }> {
    try {
      // Cloud'dan user data al
      const cloudData = await this.loadUserDataFromCloud();

      // Local'deki user data'yı al
      const localDataStr = localStorage.getItem("vocabulary-user-data");
      const localData = localDataStr ? JSON.parse(localDataStr) : {};

      if (
        Object.keys(cloudData).length === 0 &&
        Object.keys(localData).length === 0
      ) {
        return { success: true, source: "empty" };
      }

      if (
        Object.keys(cloudData).length > 0 &&
        Object.keys(localData).length === 0
      ) {
        // Sadece cloud'da veri var, local'e koy
        localStorage.setItem("vocabulary-user-data", JSON.stringify(cloudData));

        // UI'ı güncelle
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
        }

        return { success: true, source: "cloud" };
      }

      if (
        Object.keys(localData).length > 0 &&
        Object.keys(cloudData).length === 0
      ) {
        // Sadece local'de veri var, cloud'a yükle
        await this.saveUserDataToCloud(localData);
        return { success: true, source: "local" };
      }

      // Her ikisinde de veri var, merge et (local öncelikli)
      const mergedData = { ...cloudData, ...localData }; // Local'deki değerler öncelikli

      // Merge edilen veriyi her iki yere de kaydet
      localStorage.setItem("vocabulary-user-data", JSON.stringify(mergedData));
      await this.saveUserDataToCloud(mergedData);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
      }

      return { success: true, source: "merged" };
    } catch (error) {
      console.error("❌ User data sync hatası:", error);
      return { success: false, source: "local" };
    }
  }

  // Her iki sync'i birden çalıştır
  static async syncAllVocabularyData(): Promise<void> {
    await this.syncProgressData();
    await this.syncUserData();
  }

  // Progress data merge (en son güncelleneni tercih et)
  private static mergeProgressData(
    local: { [key: string]: WordProgress },
    cloud: { [key: string]: WordProgress }
  ): { [key: string]: WordProgress } {
    const merged = { ...cloud }; // Cloud'dan başla

    // Local'deki her item için kontrol et
    Object.keys(local).forEach((wordId) => {
      const localItem = local[wordId];
      const cloudItem = merged[wordId];

      if (!cloudItem) {
        // Cloud'da yok, local'i ekle
        merged[wordId] = localItem;
      } else {
        // Her ikisinde de var, en son güncelleneni al
        const localDate = localItem.lastReviewDate
          ? new Date(localItem.lastReviewDate)
          : new Date(0);
        const cloudDate = cloudItem.lastReviewDate
          ? new Date(cloudItem.lastReviewDate)
          : new Date(0);

        if (localDate >= cloudDate) {
          merged[wordId] = localItem;
        }
      }
    });

    return merged;
  }
}

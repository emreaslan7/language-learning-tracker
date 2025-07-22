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
  private static PROGRESS_DOC = "main_vocabulary_progress"; // Sabit progress document ID
  private static USER_DATA_DOC = "main_vocabulary_userdata"; // Sabit user data document ID

  // Vocabulary progress'i Firebase'e kaydet
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
            ? item.lastReviewDate.toISOString()
            : null,
          nextReviewDate: item.nextReviewDate
            ? item.nextReviewDate.toISOString()
            : null,
        };
        return acc;
      }, {} as Record<string, CleanedWordProgress>);

      await setDoc(docRef, {
        progress: cleanedProgress,
        lastUpdated: new Date(),
        version: 1,
      });

      console.log(
        `✅ Vocabulary progress Firebase'e kaydedildi (${
          Object.keys(progressData).length
        } kelime)`
      );
      return true;
    } catch (error) {
      console.error("❌ Firebase vocabulary progress kayıt hatası:", error);
      return false;
    }
  }

  // User data'yı Firebase'e kaydet
  static async saveUserDataToCloud(userData: {
    [key: string]: UserWordData;
  }): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.USER_DATA_DOC);

      await setDoc(docRef, {
        userData,
        lastUpdated: new Date(),
        version: 1,
      });

      console.log(
        `✅ Vocabulary user data Firebase'e kaydedildi (${
          Object.keys(userData).length
        } kelime)`
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

        console.log("✅ Vocabulary progress Firebase'den yüklendi");
        return convertedProgress;
      } else {
        console.log("📝 Firebase'de vocabulary progress bulunamadı");
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
        console.log("✅ Vocabulary user data Firebase'den yüklendi");
        return data.userData || {};
      } else {
        console.log("📝 Firebase'de vocabulary user data bulunamadı");
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
      console.log("🔄 Vocabulary progress sync başlatılıyor...");

      // Cloud'dan progress al
      const cloudData = await this.loadProgressFromCloud();
      console.log(
        "☁️ Cloud'dan alınan vocabulary progress sayısı:",
        Object.keys(cloudData).length
      );

      // Local'deki progress'i al
      const localDataStr = localStorage.getItem("vocabulary-progress");
      const localData = localDataStr ? JSON.parse(localDataStr) : {};
      console.log(
        "💾 Local'deki vocabulary progress sayısı:",
        Object.keys(localData).length
      );

      if (
        Object.keys(cloudData).length === 0 &&
        Object.keys(localData).length === 0
      ) {
        console.log("ℹ️ Hem cloud hem local vocabulary progress boş");
        return { success: true, source: "empty" };
      }

      if (
        Object.keys(cloudData).length > 0 &&
        Object.keys(localData).length === 0
      ) {
        // Sadece cloud'da veri var, local'e koy
        console.log("📥 Vocabulary progress cloud'dan local'e kopyalanıyor");
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
        console.log("📤 Vocabulary progress local'den cloud'a yükleniyor");
        await this.saveProgressToCloud(localData);
        return { success: true, source: "local" };
      }

      // Her ikisinde de veri var, merge et
      console.log("🔀 Vocabulary progress verileri merge ediliyor");
      const mergedData = this.mergeProgressData(localData, cloudData);

      // Merge edilen veriyi her iki yere de kaydet
      localStorage.setItem("vocabulary-progress", JSON.stringify(mergedData));
      await this.saveProgressToCloud(mergedData);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyProgressChanged"));
      }

      console.log(
        "✅ Vocabulary progress sync tamamlandı, toplam veri:",
        Object.keys(mergedData).length
      );
      return { success: true, source: "merged" };
    } catch (error) {
      console.error("❌ Vocabulary progress sync hatası:", error);
      return { success: false, source: "local" };
    }
  }

  // User data senkronizasyonu
  static async syncUserData(): Promise<{ success: boolean; source: string }> {
    try {
      console.log("🔄 Vocabulary user data sync başlatılıyor...");

      // Cloud'dan user data al
      const cloudData = await this.loadUserDataFromCloud();
      console.log(
        "☁️ Cloud'dan alınan user data sayısı:",
        Object.keys(cloudData).length
      );

      // Local'deki user data'yı al
      const localDataStr = localStorage.getItem("vocabulary-user-data");
      const localData = localDataStr ? JSON.parse(localDataStr) : {};
      console.log(
        "💾 Local'deki user data sayısı:",
        Object.keys(localData).length
      );

      if (
        Object.keys(cloudData).length === 0 &&
        Object.keys(localData).length === 0
      ) {
        console.log("ℹ️ Hem cloud hem local user data boş");
        return { success: true, source: "empty" };
      }

      if (
        Object.keys(cloudData).length > 0 &&
        Object.keys(localData).length === 0
      ) {
        // Sadece cloud'da veri var, local'e koy
        console.log("📥 User data cloud'dan local'e kopyalanıyor");
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
        console.log("📤 User data local'den cloud'a yükleniyor");
        await this.saveUserDataToCloud(localData);
        return { success: true, source: "local" };
      }

      // Her ikisinde de veri var, merge et (local öncelikli)
      console.log("🔀 User data verileri merge ediliyor");
      const mergedData = { ...cloudData, ...localData }; // Local'deki değerler öncelikli

      // Merge edilen veriyi her iki yere de kaydet
      localStorage.setItem("vocabulary-user-data", JSON.stringify(mergedData));
      await this.saveUserDataToCloud(mergedData);

      // UI'ı güncelle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vocabularyUserDataChanged"));
      }

      console.log(
        "✅ User data sync tamamlandı, toplam veri:",
        Object.keys(mergedData).length
      );
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

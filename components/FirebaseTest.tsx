import { ProgressTracker } from "../data/language-learning/progressTracker";
import { db } from "../lib/firebase";

// Firebase test component'i
export const FirebaseTest = () => {
  const testFirebase = async () => {
    console.log("🔥 Firebase Test Başlatılıyor...");

    // Firebase config kontrolü
    console.log("📝 Firebase Config:");
    console.log(
      "Database instance:",
      db ? "✅ Firebase DB mevcut" : "❌ Firebase DB yok"
    );

    try {
      // Cloud sync test
      await ProgressTracker.initCloudSync();
      console.log("✅ Firebase bağlantısı başarılı!");

      // Test verisi kaydet
      await ProgressTracker.completeTask(1, 1, "warmUp");
      console.log("✅ Test verisi kaydedildi!");
    } catch (error) {
      console.error("❌ Firebase hatası:", error);
    }
  };

  return (
    <button
      onClick={testFirebase}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      🔥 Firebase Test
    </button>
  );
};

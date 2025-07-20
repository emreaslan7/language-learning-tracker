import { ProgressTracker } from "../data/language-learning/progressTracker";

// Firebase test component'i
export const FirebaseTest = () => {
  const testFirebase = async () => {
    console.log("🔥 Firebase Test Başlatılıyor...");

    // Environment variables kontrolü
    console.log("📝 Env Variables:");
    console.log(
      "API_KEY:",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Var" : "❌ Yok"
    );
    console.log(
      "PROJECT_ID:",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Var" : "❌ Yok"
    );
    console.log(
      "AUTH_DOMAIN:",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Var" : "❌ Yok"
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

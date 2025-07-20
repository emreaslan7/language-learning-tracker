import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config - Production için hardcoded values
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDRjdutTRPhk0DGoK03A78f5Y54ks43F4k",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "language-learning-tracke-73228.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "language-learning-tracke-73228",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "language-learning-tracke-73228.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "622927570433",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:622927570433:web:1327c909ab7b32efb4c200",
};

console.log("🔥 Firebase config yüklendi:", {
  apiKey: firebaseConfig.apiKey
    ? firebaseConfig.apiKey.substring(0, 10) + "..."
    : "YOK",
  projectId: firebaseConfig.projectId || "YOK",
});

// Firebase'i initialize et
const app = initializeApp(firebaseConfig);

// Firestore database'i export et
export const db = getFirestore(app);

export default app;

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGo8DGsq-g6De6klbsGjgcS1nVZ_n22p4",
  authDomain: "nova-raiz-jiujitsu.firebaseapp.com",
  projectId: "nova-raiz-jiujitsu",
  storageBucket: "nova-raiz-jiujitsu.firebasestorage.app",
  messagingSenderId: "1096031199652",
  appId: "1:1096031199652:web:5c9f5eaf644a369a212131",
  measurementId: "G-ZWDKRH934F",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const secondaryApp =
  getApps().find((item) => item.name === "secondary") ||
  initializeApp(firebaseConfig, "secondary");

export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
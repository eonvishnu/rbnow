import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage"; // 1. Import the Storage service

const firebaseConfig = {
  apiKey: "AIzaSyDTHFyJX0TZp1a2wEH5OBO4udup5ZKGNNM",
  authDomain: "eonlink-ecom.firebaseapp.com",
  databaseURL: "https://eonlink-ecom-default-rtdb.firebaseio.com",
  projectId: "eonlink-ecom",
  storageBucket: "eonlink-ecom.firebasestorage.app",
  messagingSenderId: "997775312600",
  appId: "1:997775312600:web:d30560d8d2a74603e3f9ad"
};

// Initialize Firebase (SSR Friendly)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // 2. Initialize Storage
const googleProvider = new GoogleAuthProvider();

// If functions are deployed in Mumbai, use "asia-south1"
const functions = getFunctions(app, "us-central1"); 

// 3. Clean Exports (Now including 'storage')
export { db, auth, storage, googleProvider, functions };
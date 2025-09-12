// Firebase Configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj5nRA_1R3RLL91PyZM11rNYDR2PTgqkc",
  authDomain: "log-in-33798.firebaseapp.com",
  projectId: "log-in-33798",
  storageBucket: "log-in-33798.firebasestorage.app",
  messagingSenderId: "300481719153",
  appId: "1:300481719153:web:69804e7364079a2373a4d0",
  measurementId: "G-LWWR2DR9L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export for use in other files
export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };

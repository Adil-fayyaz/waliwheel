// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// IMPORTANTE: Sostituisci con le tue credenziali Firebase
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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;


// ===== FIREBASE CONFIGURATION =====

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt8gG0H0m-00m5qk71cpV411BFvs1jzQ0",
    authDomain: "autromotive.firebaseapp.com",
    projectId: "autromotive",
    storageBucket: "autromotive.firebasestorage.app",
    messagingSenderId: "605267968435",
    appId: "1:605267968435:web:a6125a79c7a5d9e6720bc6",
    measurementId: "G-VF1F027LHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Firebase Auth Functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        }));
        
        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        return true;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Auth State Observer
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Get Current User
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
    return auth.currentUser !== null;
};

// Get user from localStorage
export const getStoredUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase initialized successfully');
});
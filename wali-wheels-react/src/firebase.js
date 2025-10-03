// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  linkWithPopup,
  unlink,
  fetchSignInMethodsForEmail,
  deleteUser
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

// Firebase Configuration
// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBj5nRA_1R3RLL91PyZM11rNYDR2PTgqkc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "log-in-33798.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "log-in-33798",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "log-in-33798.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "300481719153",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:300481719153:web:69804e7364079a2373a4d0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LWWR2DR9L2"
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Firebase configuration incomplete. Missing:', missingFields);
    console.warn('🔧 Please check your .env file or Firebase Console configuration');
    return false;
  }
  
  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase
let app;
let auth;
let storage;
let googleProvider;

try {
  if (!validateFirebaseConfig()) {
    throw new Error('Firebase configuration is incomplete');
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  
  // Configure Google Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Fallback configuration for development
  if (import.meta.env.DEV) {
    console.warn('🔧 Using fallback configuration for development');
    const fallbackConfig = {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "demo-app-id"
    };
    
    try {
      app = initializeApp(fallbackConfig);
      auth = getAuth(app);
      storage = getStorage(app);
      googleProvider = new GoogleAuthProvider();
      console.log('⚠️ Using fallback Firebase configuration');
    } catch (fallbackError) {
      console.error('❌ Fallback configuration also failed:', fallbackError);
    }
  }
}

// Export Firebase services
export { 
  auth, 
  storage, 
  googleProvider,
  // Auth functions
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  linkWithPopup,
  unlink,
  fetchSignInMethodsForEmail,
  deleteUser,
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Error handling utilities
export const getErrorMessage = (error) => {
  const errorMessages = {
    'auth/popup-closed-by-user': 'Accesso annullato dall\'utente',
    'auth/popup-blocked': 'Popup bloccato dal browser. Prova a disabilitare il blocco popup.',
    'auth/unauthorized-domain': `Dominio non autorizzato: ${window.location.hostname}. Aggiungi questo dominio in Firebase Console → Authentication → Settings → Authorized domains`,
    'auth/network-request-failed': 'Errore di rete. Controlla la connessione internet.',
    'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
    'auth/user-disabled': 'Account disabilitato. Contatta l\'amministratore.',
    'auth/operation-not-allowed': 'Operazione non consentita. Controlla la configurazione Firebase.',
    'auth/account-exists-with-different-credential': 'Esiste già un account con questa email ma con un provider diverso. Prova a fare login con il provider corretto.',
    'auth/requires-recent-login': 'Questa operazione richiede un accesso recente. Effettua nuovamente il login.',
    'auth/weak-password': 'La password è troppo debole. Scegli una password più forte.',
    'auth/email-already-in-use': 'Questa email è già in uso da un altro account.',
    'auth/invalid-email': 'Email non valida.',
    'auth/user-not-found': 'Utente non trovato.',
    'auth/wrong-password': 'Password errata.',
    'auth/invalid-credential': 'Credenziali non valide.',
    'auth/credential-already-in-use': 'Queste credenziali sono già in uso da un altro account.'
  };
  
  return errorMessages[error.code] || `Errore: ${error.message}`;
};

// Check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  return !!(app && auth && storage);
};

// Get current user safely
export const getCurrentUser = () => {
  if (!auth) {
    console.warn('⚠️ Firebase Auth not initialized');
    return null;
  }
  return auth.currentUser;
};

// Debug information
if (import.meta.env.DEV) {
  console.log('🔧 Firebase Debug Info:');
  console.log('- Config valid:', validateFirebaseConfig());
  console.log('- Firebase initialized:', isFirebaseInitialized());
  console.log('- Current domain:', window.location.hostname);
  console.log('- Environment:', import.meta.env.MODE);
}


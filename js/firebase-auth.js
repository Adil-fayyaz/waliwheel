// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// INCOLLA QUI il tuo firebaseConfig copiato dalla console
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
const provider = new GoogleAuthProvider();

// -- resto del codice per il login

// Funzione per login con Google
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Utente loggato:', user);
    
    // Mostra notifica di successo
    if (window.showToast) {
      window.showToast('Accesso effettuato con successo!', 'success');
    }
    
    // Aggiorna l'interfaccia
    updateAuthUI(user);
    
    return user;
  } catch (error) {
    console.error('Errore durante il login:', error);
    
    // Mostra notifica di errore
    if (window.showToast) {
      window.showToast('Errore durante l\'accesso', 'error');
    }
  }
}

// Funzione per logout
async function signOutUser() {
  try {
    await signOut(auth);
    console.log('Utente disconnesso');
    
    // Mostra notifica
    if (window.showToast) {
      window.showToast('Logout effettuato', 'info');
    }
    
    // Aggiorna l'interfaccia
    updateAuthUI(null);
  } catch (error) {
    console.error('Errore durante il logout:', error);
  }
}

// Funzione per aggiornare l'interfaccia utente
function updateAuthUI(user) {
  const authContainer = document.getElementById('authContainer');
  const profileMenu = document.getElementById('profileMenu');
  
  if (user) {
    // Utente loggato - mostra menu profilo
    if (authContainer) authContainer.style.display = 'none';
    if (profileMenu) profileMenu.style.display = 'block';
    
    // Aggiorna nome utente se presente
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
      const span = profileBtn.querySelector('span');
      if (span) span.textContent = user.displayName || 'Profilo';
    }
  } else {
    // Utente non loggato - mostra pulsanti auth
    if (authContainer) authContainer.style.display = 'block';
    if (profileMenu) profileMenu.style.display = 'none';
  }
}

// Listener per cambiamenti di stato autenticazione
onAuthStateChanged(auth, (user) => {
  updateAuthUI(user);
});

// Esporta le funzioni per uso globale
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.auth = auth;

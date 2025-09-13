// Demo: Firebase Auth (Google) using CDN modular v9+
// 1) Incolla la tua configurazione qui sotto. Trovi i dati in Firebase Console → Impostazioni progetto → SDK setup.
//    IMPORTANTE: aggiungi anche il dominio Vercel in Firebase → Autenticazione → Impostazioni → Domini autorizzati.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// ▼▼▼ Sostituisci questo oggetto con il TUO firebaseConfig dalla console Firebase ▼▼▼
const firebaseConfig = {
  apiKey: 'PASTE_YOUR_apiKey',
  authDomain: 'PASTE_YOUR_authDomain',
  projectId: 'PASTE_YOUR_projectId',
  storageBucket: 'PASTE_YOUR_storageBucket',
  messagingSenderId: 'PASTE_YOUR_messagingSenderId',
  appId: 'PASTE_YOUR_appId'
};
// ▲▲▲ Fine zona da sostituire ▲▲▲

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elements
const statusEl = document.getElementById('status');
const loggedOutEl = document.getElementById('loggedOut');
const loggedInEl = document.getElementById('loggedIn');
const btnGoogle = document.getElementById('googleBtn');
const btnLogout = document.getElementById('logoutBtn');
const avatar = document.getElementById('avatar');
const displayName = document.getElementById('displayName');
const email = document.getElementById('email');

function setStatus(message, type = 'info') {
  statusEl.textContent = message || '';
  statusEl.className = 'status' + (type === 'error' ? ' status--error' : ' status--info');
}

function showLoggedIn(user) {
  if (!user) return;
  displayName.textContent = user.displayName || 'Utente Google';
  email.textContent = user.email || '';
  if (user.photoURL) {
    avatar.src = user.photoURL;
    avatar.style.visibility = 'visible';
  }
  loggedOutEl.classList.add('state--hidden');
  loggedInEl.classList.remove('state--hidden');
}

function showLoggedOut() {
  loggedInEl.classList.add('state--hidden');
  loggedOutEl.classList.remove('state--hidden');
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    setStatus('Sei autenticato.');
    showLoggedIn(user);
  } else {
    setStatus('Non sei autenticato.');
    showLoggedOut();
  }
});

// Try to process redirect result (fallback path for popup-blocked devices)
getRedirectResult(auth).then((result) => {
  if (result && result.user) {
    setStatus('Accesso completato via redirect.');
  }
}).catch((err) => {
  console.warn('Redirect error:', err);
});

// Login handler
btnGoogle.addEventListener('click', async () => {
  setStatus('Avvio accesso con Google...');
  try {
    try {
      await signInWithPopup(auth, provider);
    } catch (popupError) {
      // Popup blocked? Use redirect as fallback
      if (popupError?.code === 'auth/popup-blocked') {
        setStatus('Popup bloccato. Reindirizzamento in corso...');
        await signInWithRedirect(auth, provider);
        return;
      }
      throw popupError;
    }
  } catch (error) {
    console.error('Google Sign-In error:', error);
    let msg = 'Errore durante il login.';
    if (error.code === 'auth/unauthorized-domain') {
      msg = `Dominio non autorizzato: ${location.hostname}. Aggiungilo in Firebase → Autenticazione → Impostazioni → Domini autorizzati.`;
    } else if (error.code === 'auth/popup-closed-by-user') {
      msg = 'Popup chiuso dall\'utente.';
    }
    setStatus(msg, 'error');
  }
});

// Logout handler
btnLogout.addEventListener('click', async () => {
  setStatus('Disconnessione...');
  try {
    await signOut(auth);
    setStatus('Sei uscito dall\'account.');
  } catch (error) {
    console.error('Logout error:', error);
    setStatus('Errore durante il logout.', 'error');
  }
});



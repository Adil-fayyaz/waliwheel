// App - Firebase Google Auth (CDN v9 modular)
// 1) Incolla qui sotto il tuo blocco firebaseConfig preso da Firebase Console
//    Console → Impostazioni progetto → Le tue app → Configura app Web
//    Sostituisci l'oggetto qui sotto con quello reale del tuo progetto.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// --- INCOLLA QUI IL TUO BLOCCO ---
// Esempio:
// const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   storageBucket: "...",
//   messagingSenderId: "...",
//   appId: "..."
// };
const firebaseConfig = {
  // TODO: incolla i dati del tuo progetto Firebase
};
// --- FINE BLOCCO ---

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elementi UI
const googleBtn = document.getElementById('googleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authArea = document.getElementById('authArea');
const profileArea = document.getElementById('profileArea');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const errorBox = document.getElementById('errorBox');

function show(view) {
  if (view === 'profile') {
    authArea.hidden = true;
    profileArea.hidden = false;
  } else {
    authArea.hidden = false;
    profileArea.hidden = true;
  }
}

function showError(message) {
  if (!message) { errorBox.hidden = true; return; }
  errorBox.textContent = message;
  errorBox.hidden = false;
}

// Stato auth in tempo reale
onAuthStateChanged(auth, (user) => {
  if (user) {
    userPhoto.src = user.photoURL || '';
    userName.textContent = user.displayName || 'Utente Google';
    userEmail.textContent = user.email || '';
    show('profile');
    showError('');
  } else {
    show('login');
  }
});

// Gestione login Google
googleBtn?.addEventListener('click', async () => {
  showError('');
  try {
    // Primo tentativo con popup
    await signInWithPopup(auth, provider);
  } catch (err) {
    // Se il popup è bloccato, usa redirect
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        showError(mapAuthError(redirectErr));
      }
    } else {
      showError(mapAuthError(err));
    }
  }
});

// Gestione esito redirect (al ritorno dalla pagina Google)
getRedirectResult(auth).catch((err) => {
  // Se fallisce il redirect, mostra errore
  showError(mapAuthError(err));
});

// Logout
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (err) {
    showError('Errore durante il logout. Riprova');
  }
});

// Mappa errori Firebase in messaggi leggibili
function mapAuthError(err) {
  if (!err) return 'Errore sconosciuto';
  switch (err.code) {
    case 'auth/unauthorized-domain':
      return `Dominio non autorizzato: aggiungi ${location.hostname} in Firebase → Authentication → Impostazioni → Domini autorizzati.`;
    case 'auth/operation-not-allowed':
      return 'Provider Google non abilitato: abilitalo in Firebase → Authentication → Metodo di accesso.';
    case 'auth/network-request-failed':
      return 'Errore di rete. Controlla la connessione e riprova.';
    case 'auth/popup-closed-by-user':
      return 'Accesso annullato. Riprova.';
    case 'auth/popup-blocked':
      return 'Popup bloccato dal browser. Useremo automaticamente il reindirizzamento.';
    default:
      return `Errore: ${err.message || err.code}`;
  }
}



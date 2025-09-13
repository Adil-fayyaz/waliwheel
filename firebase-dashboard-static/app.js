// Firebase Google Auth + Firestore (CDN v9 modular)
// 1) Incolla qui sotto il TUO firebaseConfig preso da Firebase Console
//    Impostazioni progetto → Le tue app → Configura app Web
// 2) Aggiungi il dominio Vercel tra i "Domini autorizzati":
//    Authentication → Impostazioni → Domini autorizzati → Aggiungi es. progetto.vercel.app

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// --- INCOLLA QUI IL TUO BLOCCO ---
// const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   storageBucket: "...",
//   messagingSenderId: "...",
//   appId: "..."
// };
const firebaseConfig = {
  // TODO: sostituisci con le tue credenziali
};
// --- FINE BLOCCO ---

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Elementi UI
const statusEl = document.getElementById('status');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const googleBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userUid = document.getElementById('userUid');
const bioForm = document.getElementById('bioForm');
const bioInput = document.getElementById('bioInput');
const saveState = document.getElementById('saveState');

function setStatus(message, type = 'info') {
  if (!message) { statusEl.hidden = true; return; }
  statusEl.textContent = message;
  statusEl.hidden = false;
  statusEl.className = 'status' + (type === 'error' ? ' error' : '');
}

function show(view) {
  if (view === 'dashboard') {
    loginView.hidden = true;
    dashboardView.hidden = false;
  } else {
    loginView.hidden = false;
    dashboardView.hidden = true;
  }
}

// Osserva stato autenticazione
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Popola UI profilo
    userPhoto.src = user.photoURL || '';
    userName.textContent = user.displayName || 'Utente Google';
    userEmail.textContent = user.email || '';
    userUid.textContent = user.uid;
    show('dashboard');
    setStatus('');

    // Carica bio da Firestore
    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      bioInput.value = snap.exists() && snap.data().bio ? snap.data().bio : '';
    } catch (err) {
      setStatus('Impossibile caricare la bio: ' + (err.message || err.code), 'error');
    }
  } else {
    show('login');
  }
});

// Gestione login Google
googleBtn?.addEventListener('click', async () => {
  setStatus('');
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
      try { await signInWithRedirect(auth, provider); } 
      catch (redirectErr) { setStatus(mapError(redirectErr), 'error'); }
    } else {
      setStatus(mapError(err), 'error');
    }
  }
});

// Gestione esito redirect
getRedirectResult(auth).catch((err) => setStatus(mapError(err), 'error'));

// Logout
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (err) {
    setStatus('Errore durante il logout. Riprova.', 'error');
  }
});

// Salva bio su Firestore
bioForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return setStatus('Devi essere autenticato per salvare.', 'error');

  saveState.textContent = 'Salvataggio...';
  try {
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { bio: bioInput.value || '' }, { merge: true });
    saveState.textContent = '✅ Salvato';
    setTimeout(() => saveState.textContent = '', 1500);
  } catch (err) {
    saveState.textContent = '';
    setStatus('Errore nel salvataggio: ' + (err.message || err.code), 'error');
  }
});

// Mappa errori comuni Firebase
function mapError(err) {
  if (!err) return 'Errore sconosciuto';
  switch (err.code) {
    case 'auth/unauthorized-domain':
      return `Dominio non autorizzato: aggiungi ${location.hostname} in Firebase → Authentication → Impostazioni → Domini autorizzati.`;
    case 'auth/operation-not-allowed':
      return 'Provider Google non abilitato (Authentication → Metodo di accesso).';
    case 'auth/network-request-failed':
      return 'Errore di rete. Controlla la connessione.';
    case 'permission-denied':
      return 'Permessi insufficienti su Firestore (controlla le regole).';
    default:
      return err.message || err.code;
  }
}



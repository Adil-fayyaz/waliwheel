// Firebase v9 modular via CDN - Auth (Google) + Firestore
// ISTRUZIONI:
// 1) Sostituisci firebaseConfig con quello della tua app (Firebase Console → Impostazioni progetto → SDK snippet)
// 2) In Firebase Console → Authentication → Impostazioni → Domini autorizzati: aggiungi il dominio Vercel del deploy
//    es. your-project.vercel.app

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
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// ▼▼▼ INCOLLA QUI LA TUA CONFIGURAZIONE ▼▼▼
const firebaseConfig = {
  apiKey: 'PASTE_YOUR_apiKey',
  authDomain: 'PASTE_YOUR_authDomain',
  projectId: 'PASTE_YOUR_projectId',
  storageBucket: 'PASTE_YOUR_storageBucket',
  messagingSenderId: 'PASTE_YOUR_messagingSenderId',
  appId: 'PASTE_YOUR_appId'
};
// ▲▲▲ FINE CONFIG ▲▲▲

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// UI Elements
const googleBtn = document.getElementById('googleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const statusEl = document.getElementById('status');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');

const avatar = document.getElementById('avatar');
const displayName = document.getElementById('displayName');
const email = document.getElementById('email');
const uid = document.getElementById('uid');

const bioForm = document.getElementById('bioForm');
const bioField = document.getElementById('bio');
const bioStatus = document.getElementById('bioStatus');

// Profile button (always visible when logged)
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');
const profileAvatar = document.getElementById('profileAvatar');
const profileNameShort = document.getElementById('profileNameShort');
const ddAvatar = document.getElementById('ddAvatar');
const ddName = document.getElementById('ddName');
const ddEmail = document.getElementById('ddEmail');

function setStatus(message, type = 'info') {
  statusEl.textContent = message || '';
  statusEl.className = 'status' + (type === 'error' ? ' status--error' : '');
}

function showGuest() {
  loginScreen.classList.remove('hidden');
  dashboard.classList.add('hidden');
  googleBtn.classList.remove('hidden');
  profileButton.classList.add('hidden');
  profileDropdown.classList.add('hidden');
}

function showUser(user) {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  googleBtn.classList.add('hidden');
  profileButton.classList.remove('hidden');

  displayName.textContent = user.displayName || 'Utente Google';
  email.textContent = user.email || '';
  uid.textContent = user.uid;
  if (user.photoURL) avatar.src = user.photoURL;
  if (user.photoURL) profileAvatar.src = user.photoURL;
  profileNameShort.textContent = user.displayName?.split(' ')[0] || 'Profilo';

  ddName.textContent = user.displayName || '';
  ddEmail.textContent = user.email || '';
  if (user.photoURL) ddAvatar.src = user.photoURL;
}

// Read bio from Firestore
async function loadBio(uidVal) {
  try {
    const ref = doc(db, 'users', uidVal);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      bioField.value = data.bio || '';
      bioStatus.textContent = 'Bio caricata.';
    } else {
      bioField.value = '';
      bioStatus.textContent = 'Nessuna bio salvata.';
    }
  } catch (err) {
    console.error('Errore lettura bio:', err);
    bioStatus.textContent = 'Errore nel caricamento della bio.';
  }
}

// Save bio to Firestore
async function saveBio(uidVal, nameVal, emailVal, photoVal) {
  try {
    const ref = doc(db, 'users', uidVal);
    await setDoc(ref, {
      displayName: nameVal || null,
      email: emailVal || null,
      photoURL: photoVal || null,
      bio: bioField.value || ''
    }, { merge: true });
    bioStatus.textContent = 'Salvato!';
  } catch (err) {
    console.error('Errore salvataggio bio:', err);
    bioStatus.textContent = 'Errore nel salvataggio.';
  }
}

// Auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    setStatus('Autenticato.');
    showUser(user);
    await loadBio(user.uid);
  } else {
    setStatus('Non autenticato.');
    showGuest();
  }
});

// Process redirect result (fallback flow)
getRedirectResult(auth).catch((err) => {
  if (err) console.warn('Redirect error:', err);
});

// Login
googleBtn.addEventListener('click', async () => {
  setStatus('Accesso in corso...');
  try {
    try {
      await signInWithPopup(auth, provider);
    } catch (popupError) {
      if (popupError?.code === 'auth/popup-blocked') {
        setStatus('Popup bloccato. Reindirizzamento...');
        await signInWithRedirect(auth, provider);
        return;
      }
      throw popupError;
    }
  } catch (err) {
    console.error('Login error:', err);
    let msg = 'Errore durante il login.';
    if (err.code === 'auth/unauthorized-domain') {
      msg = `Dominio non autorizzato: ${location.hostname}. Aggiungilo in Firebase → Authentication → Settings → Authorized domains.`;
    }
    setStatus(msg, 'error');
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    setStatus('Sei uscito.');
  } catch (err) {
    console.error('Logout error:', err);
    setStatus('Errore durante il logout.', 'error');
  }
});

// Profile dropdown interactions
document.addEventListener('click', (e) => {
  if (profileButton.classList.contains('hidden')) return;
  const isBtn = e.target.closest('#profileButton');
  const isDrop = e.target.closest('#profileDropdown');
  if (isBtn) {
    e.preventDefault();
    const expanded = profileButton.getAttribute('aria-expanded') === 'true';
    profileButton.setAttribute('aria-expanded', String(!expanded));
    profileDropdown.classList.toggle('hidden');
  } else if (!isDrop) {
    profileDropdown.classList.add('hidden');
    profileButton.setAttribute('aria-expanded', 'false');
  }
});

// Save bio form
bioForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) { setStatus('Devi essere autenticato per salvare.'); return; }
  bioStatus.textContent = 'Salvataggio...';
  await saveBio(user.uid, user.displayName, user.email, user.photoURL);
});



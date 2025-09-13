/**
 * Google Auth UI (Firebase CDN v9+)
 * - Integra login Google nell'header esistente senza cambiare il design
 * - Mostra pulsante "Accedi con Google" quando NON loggato
 * - Dopo il login mostra: foto, nome, email e pulsante "Esci"
 * - Usa signInWithPopup con fallback signInWithRedirect
 *
 * ISTRUZIONI: incolla la tua firebaseConfig qui sotto (apiKey, authDomain, ecc.).
 */

// Import modular SDK v9 da CDN
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// === INCOLLA QUI IL TUO BLOCCO firebaseConfig ===
// Esempio:
// const firebaseConfig = {
//   apiKey: '...'
//   authDomain: '...'
//   projectId: '...'
//   appId: '...'
// };
const firebaseConfig = {
  // TODO: incolla qui i valori reali del tuo progetto Firebase
};
// === FINE BLOCCO CONFIG ===

// Inizializza (evita doppia init)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Helpers DOM
function ensureContainer() {
  // Preferisci l'area dedicata se esiste, altrimenti nav-actions
  let mount = document.getElementById('authContainer');
  if (!mount) {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return null;
    mount = navActions;
  }

  // Evita duplicati
  let area = document.getElementById('googleAuthArea');
  if (!area) {
    area = document.createElement('div');
    area.id = 'googleAuthArea';
    // Mantieni coerenza con il design (usa classi già presenti)
    area.style.display = 'inline-block';
    mount.prepend(area);
  }
  return area;
}

function renderSignedOut() {
  const area = ensureContainer();
  if (!area) return;
  area.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'glow-cta';
  wrapper.innerHTML = '<button type="button" id="googleSignInBtn">Accedi con Google</button>';
  area.appendChild(wrapper);

  const btn = wrapper.querySelector('#googleSignInBtn');
  btn?.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          console.error('Redirect error:', redirectErr);
          alert(formatAuthError(redirectErr));
        }
      } else {
        console.error('Popup error:', err);
        alert(formatAuthError(err));
      }
    }
  });
}

function renderSignedIn(user) {
  const area = ensureContainer();
  if (!area) return;
  area.innerHTML = '';

  const name = user.displayName || 'Utente Google';
  const email = user.email || '';
  const photo = user.photoURL || '';

  // Usa lo stile già introdotto per il profilo
  const wrapper = document.createElement('div');
  wrapper.className = 'profile-button-wrapper';
  wrapper.innerHTML = `
    <div class="profile-button" id="gaProfileBtn">
      <div class="profile-avatar">
        <img src="${photo}" alt="Profile" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="avatar-fallback" style="display:none;">👤</div>
      </div>
      <div class="profile-info">
        <span class="profile-name">${name}</span>
        <span class="profile-email">${email}</span>
      </div>
      <div class="profile-dropdown" id="gaProfileDropdown">
        <a href="profilo.html" class="profile-link">👤 Il Mio Profilo</a>
        <a href="#" class="profile-link" id="gaLogoutLink">🚪 Esci</a>
      </div>
    </div>
  `;
  area.appendChild(wrapper);

  const profileBtn = wrapper.querySelector('#gaProfileBtn');
  const dropdown = wrapper.querySelector('#gaProfileDropdown');
  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) dropdown?.classList.remove('active');
  });

  const logoutLink = wrapper.querySelector('#gaLogoutLink');
  logoutLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
      alert('Errore durante il logout. Riprova.');
    }
  });
}

function formatAuthError(err) {
  switch (err?.code) {
    case 'auth/unauthorized-domain':
      return `Dominio non autorizzato: aggiungi ${location.hostname} in Firebase → Authentication → Impostazioni → Domini autorizzati.`;
    case 'auth/operation-not-allowed':
      return 'Provider Google non abilitato in Firebase → Authentication → Metodo di accesso.';
    case 'auth/network-request-failed':
      return 'Errore di rete. Controlla la connessione e riprova.';
    case 'auth/popup-closed-by-user':
      return 'Accesso annullato.';
    default:
      return `Errore: ${err?.message || err?.code || 'sconosciuto'}`;
  }
}

// Al cambio stato aggiorna UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderSignedIn(user);
  } else {
    renderSignedOut();
  }
});

// Gestisci risultato post-redirect
getRedirectResult(auth).catch((err) => {
  if (err) {
    console.error('Redirect result error:', err);
    alert(formatAuthError(err));
  }
});

// Primo render
document.addEventListener('DOMContentLoaded', () => {
  // Mostra subito pulsante finché non arriva onAuthStateChanged
  renderSignedOut();
});

// Esponi utilità per debug opzionale
window.googleAuthUI = { auth };



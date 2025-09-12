/**
 * Firebase Authentication con Google - Esempio Completo
 * 
 * ISTRUZIONI PER LA CONFIGURAZIONE:
 * 1. Vai su https://console.firebase.google.com/
 * 2. Crea un nuovo progetto o seleziona uno esistente
 * 3. Vai su "Authentication" → "Sign-in method"
 * 4. Abilita "Google" come provider
 * 5. In "Authentication" → "Settings" → "Authorized domains"
 *    aggiungi il tuo dominio Vercel (es: tuoprogetto.vercel.app)
 * 6. Sostituisci la configurazione firebaseConfig qui sotto con i tuoi dati
 */

// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// ⚠️ SOSTITUISCI QUESTA CONFIGURAZIONE CON I TUOI DATI FIREBASE ⚠️
const firebaseConfig = {
    apiKey: "AIzaSyBj5nRA_1R3RLL91PyZM11rNYDR2PTgqkc",
    authDomain: "log-in-33798.firebaseapp.com",
    projectId: "log-in-33798",
    storageBucket: "log-in-33798.firebasestorage.app",
    messagingSenderId: "300481719153",
    appId: "1:300481719153:web:69804e7364079a2373a4d0",
    measurementId: "G-LWWR2DR9L2"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configurazione del provider Google
provider.setCustomParameters({
    prompt: 'select_account' // Forza la selezione dell'account
});

// Elementi DOM
const authContainer = document.getElementById('auth-container');
const userContainer = document.getElementById('user-container');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhoto = document.getElementById('user-photo');

// Utility functions
function showLoading() {
    loading.style.display = 'flex';
    googleLoginBtn.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    googleLoginBtn.style.display = 'flex';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

function updateUI(user) {
    if (user) {
        // Utente autenticato
        authContainer.style.display = 'none';
        userContainer.style.display = 'block';
        
        // Aggiorna informazioni utente
        userName.textContent = user.displayName || 'Utente';
        userEmail.textContent = user.email || '';
        userPhoto.src = user.photoURL || '';
        userPhoto.alt = `Foto profilo di ${user.displayName || 'utente'}`;
        
        console.log('✅ Utente autenticato:', user);
    } else {
        // Nessun utente autenticato
        authContainer.style.display = 'block';
        userContainer.style.display = 'none';
        
        console.log('❌ Nessun utente autenticato');
    }
}

// Funzione per il login con popup
async function signInWithGooglePopup() {
    try {
        showLoading();
        hideError();
        
        console.log('🚀 Tentativo di login con Google (popup)...');
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log('✅ Login riuscito con popup:', user);
        updateUI(user);
        
    } catch (error) {
        console.error('❌ Errore login popup:', error);
        hideLoading();
        
        // Gestione errori specifici
        if (error.code === 'auth/popup-closed-by-user') {
            showError('Accesso annullato dall\'utente');
        } else if (error.code === 'auth/popup-blocked') {
            showError('Popup bloccato dal browser. Tentativo con redirect...');
            await signInWithGoogleRedirect();
        } else if (error.code === 'auth/unauthorized-domain') {
            showError(`Dominio non autorizzato: ${location.hostname}. Aggiungi questo dominio in Firebase Console.`);
        } else if (error.code === 'auth/operation-not-allowed') {
            showError('Provider Google non abilitato in Firebase Console.');
        } else {
            showError(`Errore durante l'accesso: ${error.message}`);
        }
    }
}

// Funzione per il login con redirect (fallback)
async function signInWithGoogleRedirect() {
    try {
        console.log('🔄 Tentativo di login con Google (redirect)...');
        
        await signInWithRedirect(auth, provider);
        // Il redirect porterà l'utente via dalla pagina
        
    } catch (error) {
        console.error('❌ Errore login redirect:', error);
        showError(`Errore durante il redirect: ${error.message}`);
    }
}

// Funzione per gestire il risultato del redirect
async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const user = result.user;
            console.log('✅ Login riuscito con redirect:', user);
            updateUI(user);
        }
    } catch (error) {
        console.error('❌ Errore gestione redirect:', error);
        showError(`Errore durante la gestione del redirect: ${error.message}`);
    }
}

// Funzione per il logout
async function signOutUser() {
    try {
        console.log('🚪 Logout in corso...');
        
        await signOut(auth);
        console.log('✅ Logout completato');
        
    } catch (error) {
        console.error('❌ Errore logout:', error);
        showError(`Errore durante il logout: ${error.message}`);
    }
}

// Event Listeners
googleLoginBtn.addEventListener('click', signInWithGooglePopup);
logoutBtn.addEventListener('click', signOutUser);

// Listener per i cambiamenti di stato dell'autenticazione
onAuthStateChanged(auth, (user) => {
    console.log('🔄 Stato autenticazione cambiato:', user ? 'Autenticato' : 'Non autenticato');
    updateUI(user);
});

// Gestione del risultato del redirect al caricamento della pagina
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 Pagina caricata, controllo redirect...');
    await handleRedirectResult();
});

// Gestione errori globali
window.addEventListener('error', (event) => {
    console.error('❌ Errore globale:', event.error);
    showError('Si è verificato un errore imprevisto. Riprova.');
});

// Gestione errori delle promise non gestite
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rifiutata:', event.reason);
    showError('Errore durante l\'operazione. Riprova.');
});

// Debug: Esponi le funzioni globalmente per il console del browser
window.firebaseAuth = {
    auth,
    provider,
    signInWithGooglePopup,
    signInWithGoogleRedirect,
    signOutUser,
    updateUI,
    showError
};

console.log('✅ Firebase Auth App inizializzata');
console.log('🔧 Per debug, usa window.firebaseAuth nel console');

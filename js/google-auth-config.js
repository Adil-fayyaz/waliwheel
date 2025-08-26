// Google OAuth Configuration
const GOOGLE_CONFIG = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Sostituisci con il tuo Client ID reale
    apiKey: 'YOUR_GOOGLE_API_KEY',     // Sostituisci con la tua API Key reale
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
    scope: 'profile email',
    redirectUri: window.location.origin
};

// Google OAuth Client
let googleAuthClient = null;

// Inizializza Google OAuth
function initGoogleAuth() {
    return new Promise((resolve, reject) => {
        // Carica Google API
        if (typeof gapi === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('auth2', () => {
                    gapi.auth2.init({
                        client_id: GOOGLE_CONFIG.clientId,
                        scope: GOOGLE_CONFIG.scope,
                        redirect_uri: GOOGLE_CONFIG.redirectUri
                    }).then(() => {
                        googleAuthClient = gapi.auth2.getAuthInstance();
                        resolve(googleAuthClient);
                    }).catch(reject);
                });
            };
            script.onerror = reject;
            document.head.appendChild(script);
        } else {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: GOOGLE_CONFIG.clientId,
                    scope: GOOGLE_CONFIG.scope,
                    redirect_uri: GOOGLE_CONFIG.redirectUri
                }).then(() => {
                    googleAuthClient = gapi.auth2.getAuthInstance();
                    resolve(googleAuthClient);
                }).catch(reject);
            });
        }
    });
}

// Login con Google
async function googleSignIn() {
    try {
        if (!googleAuthClient) {
            await initGoogleAuth();
        }
        
        const googleUser = await googleAuthClient.signIn();
        const profile = googleUser.getBasicProfile();
        const idToken = googleUser.getAuthResponse().id_token;
        
        // Salva i dati utente
        const userData = {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            picture: profile.getImageUrl(),
            token: idToken,
            isAuthenticated: true,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Aggiorna UI
        updateAuthUI(userData);
        
        return userData;
    } catch (error) {
        console.error('Errore login Google:', error);
        throw error;
    }
}

// Logout Google
async function googleSignOut() {
    try {
        if (googleAuthClient) {
            await googleAuthClient.signOut();
        }
        
        // Rimuovi dati utente
        localStorage.removeItem('userData');
        
        // Aggiorna UI
        updateAuthUI(null);
        
        return true;
    } catch (error) {
        console.error('Errore logout Google:', error);
        throw error;
    }
}

// Verifica stato autenticazione
function checkAuthStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.isAuthenticated && user.token) {
                updateAuthUI(user);
                return user;
            }
        } catch (error) {
            console.error('Errore parsing userData:', error);
            localStorage.removeItem('userData');
        }
    }
    
    updateAuthUI(null);
    return null;
}

// Aggiorna UI in base allo stato autenticazione
function updateAuthUI(userData) {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    
    if (userData && userData.isAuthenticated) {
        // Utente autenticato
        if (authButtons) authButtons.classList.add('hidden');
        if (userProfile) {
            userProfile.classList.remove('hidden');
            
            // Aggiorna dati utente
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userAvatarImg = document.getElementById('userAvatarImg');
            
            if (userName) userName.textContent = userData.name || 'Utente';
            if (userEmail) userEmail.textContent = userData.email || '';
            if (userAvatarImg) {
                userAvatarImg.src = userData.picture || 'assets/images/default-avatar.png';
                userAvatarImg.alt = `Avatar di ${userData.name}`;
            }
        }
    } else {
        // Utente non autenticato
        if (authButtons) authButtons.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
    }
}

// Gestione eventi menu utente
function setupUserMenuEvents() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]')) {
            const action = e.target.closest('[data-action]').dataset.action;
            handleUserAction(action);
        }
    });
}

// Gestisce le azioni del menu utente
function handleUserAction(action) {
    switch (action) {
        case 'profile':
            showUserProfile();
            break;
        case 'orders':
            showUserOrders();
            break;
        case 'favorites':
            showUserFavorites();
            break;
        case 'settings':
            showUserSettings();
            break;
        case 'logout':
            googleSignOut();
            break;
        default:
            console.log('Azione non riconosciuta:', action);
    }
}

// Funzioni per le azioni del menu
function showUserProfile() {
    alert('Profilo utente - Funzionalità in sviluppo');
}

function showUserOrders() {
    alert('I Miei Ordini - Funzionalità in sviluppo');
}

function showUserFavorites() {
    alert('Auto Preferite - Funzionalità in sviluppo');
}

function showUserSettings() {
    alert('Impostazioni - Funzionalità in sviluppo');
}

// Inizializza tutto quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica stato autenticazione
    checkAuthStatus();
    
    // Setup eventi menu utente
    setupUserMenuEvents();
    
    // Setup pulsante login
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            googleSignIn().catch(error => {
                console.error('Errore durante il login:', error);
                alert('Errore durante il login. Riprova.');
            });
        });
    }
});

// Esporta funzioni per uso esterno
window.GoogleAuth = {
    init: initGoogleAuth,
    signIn: googleSignIn,
    signOut: googleSignOut,
    checkStatus: checkAuthStatus,
    updateUI: updateAuthUI
};


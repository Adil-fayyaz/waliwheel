// Google OAuth Demo - Versione funzionante senza API key reale
// PER PRODUZIONE: sostituisci con js/google-auth-config.js e le tue API key reali

// Simula autenticazione Google per demo
let isAuthenticated = false;
let currentUser = null;

// Inizializza autenticazione demo
function initDemoAuth() {
    console.log('🚀 Autenticazione Demo inizializzata');
    
    // Verifica se c'è già un utente autenticato
    const savedUser = localStorage.getItem('demoUserData');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            updateAuthUI(currentUser);
        } catch (error) {
            console.error('Errore parsing dati utente:', error);
            localStorage.removeItem('demoUserData');
        }
    }
    
    // Setup eventi
    setupAuthEvents();
}

// Setup eventi autenticazione
function setupAuthEvents() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', handleDemoLogin);
    }
    
    // Setup eventi menu utente
    setupUserMenuEvents();
}

// Gestisce il login demo
function handleDemoLogin() {
    if (isAuthenticated) {
        // Se già autenticato, mostra menu profilo
        toggleUserMenu();
        return;
    }
    
    // Simula popup Google
    showDemoLoginModal();
}

// Mostra modale login demo
function showDemoLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'demo-login-modal';
    modal.innerHTML = `
        <div class="demo-login-content">
            <h3>🔐 Login Demo - Wali Wheelse</h3>
            <p>Questa è una versione demo. In produzione userai Google OAuth reale.</p>
            
            <div class="demo-login-options">
                <button class="demo-login-btn google" onclick="demoGoogleLogin()">
                    <svg viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Accedi con Google (Demo)
                </button>
                
                <button class="demo-login-btn guest" onclick="demoGuestLogin()">
                    👤 Accedi come Ospite
                </button>
            </div>
            
            <button class="demo-close-btn" onclick="closeDemoModal()">✕ Chiudi</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Stili per il modale
    const style = document.createElement('style');
    style.textContent = `
        .demo-login-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .demo-login-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            color: white;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .demo-login-options {
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .demo-login-btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .demo-login-btn.google {
            background: #4285f4;
            color: white;
        }
        
        .demo-login-btn.guest {
            background: #34a853;
            color: white;
        }
        
        .demo-login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .demo-close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        .demo-close-btn:hover {
            background: rgba(255,255,255,0.3);
        }
    `;
    
    document.head.appendChild(style);
}

// Chiude modale demo
function closeDemoModal() {
    const modal = document.querySelector('.demo-login-modal');
    if (modal) {
        modal.remove();
    }
}

// Login demo con Google
function demoGoogleLogin() {
    // Simula dati utente Google
    const userData = {
        id: 'demo_' + Date.now(),
        name: 'Mario Rossi',
        email: 'mario.rossi@gmail.com',
        picture: 'https://via.placeholder.com/150/667eea/ffffff?text=MR',
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        provider: 'google'
    };
    
    // Salva dati utente
    localStorage.setItem('demoUserData', JSON.stringify(userData));
    currentUser = userData;
    isAuthenticated = true;
    
    // Aggiorna UI
    updateAuthUI(userData);
    
    // Chiudi modale
    closeDemoModal();
    
    // Mostra notifica
    showNotification('✅ Login effettuato con successo!', 'success');
}

// Login demo come ospite
function demoGuestLogin() {
    const userData = {
        id: 'guest_' + Date.now(),
        name: 'Ospite',
        email: 'ospite@waliwheelse.it',
        picture: 'https://via.placeholder.com/150/34a853/ffffff?text=O',
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        provider: 'guest'
    };
    
    localStorage.setItem('demoUserData', JSON.stringify(userData));
    currentUser = userData;
    isAuthenticated = true;
    
    updateAuthUI(userData);
    closeDemoModal();
    showNotification('✅ Accesso come ospite effettuato!', 'info');
}

// Logout demo
function demoLogout() {
    localStorage.removeItem('demoUserData');
    currentUser = null;
    isAuthenticated = false;
    
    updateAuthUI(null);
    showNotification('👋 Logout effettuato!', 'info');
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
            demoLogout();
            break;
        default:
            console.log('Azione non riconosciuta:', action);
    }
}

// Funzioni per le azioni del menu
function showUserProfile() {
    showNotification('👤 Profilo utente - Funzionalità in sviluppo', 'info');
}

function showUserOrders() {
    showNotification('📋 I Miei Ordini - Funzionalità in sviluppo', 'info');
}

function showUserFavorites() {
    showNotification('❤️ Auto Preferite - Funzionalità in sviluppo', 'info');
}

function showUserSettings() {
    showNotification('⚙️ Impostazioni - Funzionalità in sviluppo', 'info');
}

// Toggle menu utente
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Mostra notifiche
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `demo-notification ${type}`;
    notification.textContent = message;
    
    // Stili notifica
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#34a853';
    } else if (type === 'info') {
        notification.style.background = '#4285f4';
    } else {
        notification.style.background = '#ea4335';
    }
    
    document.body.appendChild(notification);
    
    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Verifica stato autenticazione
function checkAuthStatus() {
    const savedUser = localStorage.getItem('demoUserData');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user.isAuthenticated) {
                currentUser = user;
                isAuthenticated = true;
                updateAuthUI(user);
                return user;
            }
        } catch (error) {
            console.error('Errore parsing dati utente:', error);
            localStorage.removeItem('demoUserData');
        }
    }
    
    updateAuthUI(null);
    return null;
}

// Inizializza tutto quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inizializzazione Autenticazione Demo');
    
    // Verifica stato autenticazione
    checkAuthStatus();
    
    // Inizializza autenticazione demo
    initDemoAuth();
});

// Esporta funzioni per uso esterno
window.DemoAuth = {
    init: initDemoAuth,
    login: handleDemoLogin,
    logout: demoLogout,
    checkStatus: checkAuthStatus,
    updateUI: updateAuthUI
};


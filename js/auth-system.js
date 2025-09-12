/**
 * Wali Wheels - Complete Authentication System
 * Sistema di autenticazione completo e funzionante
 */

// Import Firebase functions
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithRedirect, getRedirectResult } from './firebase-config.js';

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Auth System...');
        
        // Debug iniziale della configurazione
        this.debugFirebaseConfig();
        
        // Monitoraggio connessione internet
        this.initConnectionMonitoring();
        
        this.loadUserFromStorage();
        this.initFirebaseAuth();
        this.updateUI();
        this.handleRedirectResult();
    }

    initConnectionMonitoring() {
        // Monitora lo stato della connessione
        window.addEventListener('online', () => {
            console.log('🌐 Connessione internet ripristinata');
            this.showToast('Connessione internet ripristinata', 'success');
        });

        window.addEventListener('offline', () => {
            console.log('❌ Connessione internet persa');
            this.showToast('Connessione internet persa', 'error');
        });

        // Testa la connessione Firebase periodicamente
        setInterval(() => {
            this.testFirebaseConnection();
        }, 30000); // Ogni 30 secondi
    }

    async testFirebaseConnection() {
        try {
            // Test semplice per verificare la connessione Firebase
            await auth.currentUser?.getIdToken(true);
        } catch (error) {
            if (error.code === 'auth/network-request-failed') {
                console.warn('⚠️ Firebase connection test failed');
            }
        }
    }

    loadUserFromStorage() {
        try {
            const stored = localStorage.getItem('waliwheels_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
                this.isAuthenticated = true;
                console.log('✅ User loaded from storage:', this.currentUser);
            }
        } catch (error) {
            console.error('❌ Error loading user from storage:', error);
        }
    }

    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('waliwheels_user', JSON.stringify(this.currentUser));
            console.log('💾 User saved to storage');
        }
    }

    clearUserFromStorage() {
        localStorage.removeItem('waliwheels_user');
        console.log('🗑️ User cleared from storage');
    }

    initFirebaseAuth() {
        console.log('🔥 Setting up Firebase Auth listener...');
        onAuthStateChanged(auth, (user) => {
            console.log('🔥 Auth state changed:', user);
            if (user) {
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    name: user.displayName || 'Utente Google'
                };
                this.isAuthenticated = true;
                this.saveUserToStorage();
                this.showToast(`Benvenuto ${this.currentUser.name}!`, 'success');
            } else {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.clearUserFromStorage();
            }
            this.updateUI();
        });
    }

    async handleRedirectResult() {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                console.log('✅ Redirect result:', result);
                const userData = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    name: result.user.displayName || 'Utente Google'
                };
                this.currentUser = userData;
                this.isAuthenticated = true;
                this.saveUserToStorage();
                this.updateUI();
                this.showToast(`Accesso completato! Benvenuto ${userData.name}!`, 'success');
            }
        } catch (error) {
            console.error('❌ Error handling redirect result:', error);
        }
    }

    async signInWithGoogle() {
        try {
            console.log('🚀 Starting Google Sign In...');
            this.showLoading('Accesso con Google...');
            
            // Verifica connessione internet
            if (!navigator.onLine) {
                throw new Error('Nessuna connessione internet');
            }
            
            let result;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    console.log(`🔄 Tentativo ${retryCount + 1}/${maxRetries}`);
                    
                    // Timeout per evitare attese infinite
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout - connessione troppo lenta')), 15000);
                    });
                    
                    const signInPromise = signInWithPopup(auth, googleProvider);
                    result = await Promise.race([signInPromise, timeoutPromise]);
                    
                    console.log('✅ Popup sign in successful');
                    break; // Successo, esci dal loop
                    
                } catch (popupError) {
                    console.log('⚠️ Popup failed:', popupError);
                    retryCount++;
                    
                    // Gestione errori specifici del popup
                    if (popupError.code === 'auth/popup-blocked') {
                        console.log('🔄 Popup bloccato, tentativo con redirect...');
                        this.showToast('Popup bloccato. Reindirizzamento...', 'info');
                        await this.signInWithRedirect();
                        return;
                        
                    } else if (popupError.code === 'auth/popup-closed-by-user') {
                        this.showToast('Accesso annullato dall\'utente', 'info');
                        return;
                        
                    } else if (popupError.code === 'auth/unauthorized-domain') {
                        this.showToast(`Dominio non autorizzato: ${location.hostname}. Aggiungi questo dominio in Firebase Console.`, 'error');
                        console.warn('🔧 Aggiungi questo dominio in Firebase Authentication → Domini autorizzati:', location.hostname);
                        return;
                        
                    } else if (popupError.code === 'auth/operation-not-allowed') {
                        this.showToast('Provider Google non abilitato in Firebase Console.', 'error');
                        console.warn('🔧 Abilita Google provider in Firebase Authentication → Sign-in method');
                        return;
                        
                    } else if (popupError.code === 'auth/network-request-failed' || popupError.message.includes('network') || popupError.message.includes('Timeout')) {
                        if (retryCount < maxRetries) {
                            console.log(`🔄 Retry ${retryCount}/${maxRetries} dopo errore di rete...`);
                            this.showToast(`Tentativo ${retryCount}/${maxRetries} - Riprovo...`, 'info');
                            await this.delay(2000 * retryCount); // Delay crescente
                            continue;
                        } else {
                            // Ultimo tentativo fallito, prova con redirect
                            console.log('🔄 Tutti i tentativi popup falliti, provo con redirect...');
                            this.showToast('Popup fallito. Provo con redirect...', 'info');
                            await this.signInWithRedirect();
                            return;
                        }
                    }
                    
                    // Se non è un errore di rete, non riprovare
                    throw popupError;
                }
            }

            if (!result) {
                throw new Error('Tutti i tentativi di login sono falliti');
            }

            const user = result.user;
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                name: user.displayName || 'Utente Google'
            };

            this.currentUser = userData;
            this.isAuthenticated = true;
            this.saveUserToStorage();
            this.updateUI();
            this.showToast(`Accesso completato! Benvenuto ${userData.name}!`, 'success');
            
            // Close modal
            this.closeModal();

        } catch (error) {
            console.error('❌ Google Sign In Error:', error);
            let message = 'Errore durante l\'accesso con Google';
            
            // Gestione errori dettagliata
            if (error.message === 'Nessuna connessione internet') {
                message = 'Nessuna connessione internet. Controlla la tua connessione.';
            } else if (error.message.includes('Timeout')) {
                message = 'Connessione troppo lenta. Prova a ricaricare la pagina.';
            } else {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        message = 'Accesso annullato dall\'utente';
                        break;
                    case 'auth/popup-blocked':
                        message = 'Popup bloccato dal browser. Prova a disabilitare il blocco popup.';
                        break;
                    case 'auth/unauthorized-domain':
                        message = `Dominio non autorizzato: ${location.hostname}`;
                        console.warn('🔧 Aggiungi questo dominio in Firebase Authentication → Domini autorizzati:', location.hostname);
                        break;
                    case 'auth/operation-not-allowed':
                        message = 'Provider Google non abilitato in Firebase Console.';
                        console.warn('🔧 Abilita Google provider in Firebase Authentication → Sign-in method');
                        break;
                    case 'auth/network-request-failed':
                        message = 'Errore di rete. Prova a ricaricare la pagina o controlla la connessione.';
                        break;
                    case 'auth/too-many-requests':
                        message = 'Troppi tentativi. Riprova più tardi.';
                        break;
                    case 'auth/user-disabled':
                        message = 'Account utente disabilitato.';
                        break;
                    case 'auth/invalid-credential':
                        message = 'Credenziali non valide. Riprova.';
                        break;
                    case 'auth/account-exists-with-different-credential':
                        message = 'Esiste già un account con questa email. Usa un altro metodo di accesso.';
                        break;
                    default:
                        message = `Errore: ${error.message}`;
                        console.error('Errore completo:', error);
                }
            }
            
            this.showToast(message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Metodo per login con redirect
    async signInWithRedirect() {
        try {
            console.log('🔄 Tentativo login con redirect...');
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error('❌ Redirect login error:', error);
            this.showToast('Errore durante il redirect. Riprova.', 'error');
        }
    }

    // Utility per delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async logout() {
        try {
            await signOut(auth);
            this.currentUser = null;
            this.isAuthenticated = false;
            this.clearUserFromStorage();
            this.updateUI();
            this.showToast('Logout completato', 'info');
        } catch (error) {
            console.error('❌ Logout error:', error);
            this.showToast('Errore durante il logout', 'error');
        }
    }

    updateUI() {
        console.log('🔄 Updating UI - isAuthenticated:', this.isAuthenticated);
        
        // Force update auth modal UI
        if (window.updateAuthUI) {
            window.updateAuthUI();
        }
        
        // Dispatch events
        if (this.isAuthenticated) {
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: this.currentUser }));
        } else {
            window.dispatchEvent(new CustomEvent('userLoggedOut'));
        }
    }

    closeModal() {
        const modal = document.getElementById('globalAuthModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('auth-modal-open');
        }
    }

    showLoading(message) {
        console.log('⏳ Loading:', message);
        // Could add a loading spinner here
    }

    hideLoading() {
        console.log('✅ Loading complete');
    }

    showToast(message, type = 'info') {
        console.log(`📢 Toast [${type}]:`, message);
        // Simple alert for now, could be enhanced with a proper toast
        if (type === 'error') {
            alert(message);
        }
    }

    // Funzione di debug per verificare la configurazione
    debugFirebaseConfig() {
        console.log('🔍 DEBUG FIREBASE CONFIGURATION:');
        console.log('📍 Current domain:', location.hostname);
        console.log('🔗 Current URL:', location.href);
        console.log('🌐 Protocol:', location.protocol);
        console.log('🔥 Firebase Auth:', auth);
        console.log('🔑 Google Provider:', googleProvider);
        console.log('👤 Current User:', auth.currentUser);
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('🌐 Online Status:', navigator.onLine);
        
        // Verifica se Firebase è inizializzato correttamente
        if (auth) {
            console.log('✅ Firebase Auth inizializzato correttamente');
        } else {
            console.error('❌ Firebase Auth NON inizializzato');
        }
        
        if (googleProvider) {
            console.log('✅ Google Provider inizializzato correttamente');
        } else {
            console.error('❌ Google Provider NON inizializzato');
        }
        
        return {
            domain: location.hostname,
            url: location.href,
            protocol: location.protocol,
            firebaseAuth: !!auth,
            googleProvider: !!googleProvider,
            currentUser: auth?.currentUser,
            online: navigator.onLine
        };
    }

    // Test manuale della connessione Firebase
    async testConnection() {
        console.log('🧪 Testing Firebase connection...');
        
        try {
            // Test 1: Verifica online status
            if (!navigator.onLine) {
                throw new Error('Nessuna connessione internet');
            }
            console.log('✅ Online status: OK');
            
            // Test 2: Verifica Firebase Auth
            if (!auth) {
                throw new Error('Firebase Auth non inizializzato');
            }
            console.log('✅ Firebase Auth: OK');
            
            // Test 3: Verifica Google Provider
            if (!googleProvider) {
                throw new Error('Google Provider non inizializzato');
            }
            console.log('✅ Google Provider: OK');
            
            // Test 4: Test connessione Firebase
            try {
                await auth.currentUser?.getIdToken(true);
                console.log('✅ Firebase connection: OK');
            } catch (error) {
                if (error.code === 'auth/network-request-failed') {
                    throw new Error('Errore di rete Firebase');
                }
                console.log('⚠️ Firebase connection test inconclusive (no user logged in)');
            }
            
            console.log('✅ All connection tests passed!');
            this.showToast('Test connessione completato con successo!', 'success');
            
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            this.showToast(`Test connessione fallito: ${error.message}`, 'error');
        }
    }
}

// Create global instance
window.authSystem = new AuthSystem();

// Expose functions globally
window.signInWithGoogle = () => window.authSystem.signInWithGoogle();
window.logout = () => window.authSystem.logout();

// Debug functions
window.debugAuth = () => window.authSystem.debugFirebaseConfig();
window.testConnection = () => window.authSystem.testConnection();
window.testGoogleLogin = () => window.authSystem.signInWithGoogle();

console.log('✅ Auth System initialized');
console.log('🔧 Debug functions available:');
console.log('  - debugAuth() - Verifica configurazione Firebase');
console.log('  - testConnection() - Testa connessione Firebase');
console.log('  - testGoogleLogin() - Testa login Google');
console.log('  - signInWithGoogle() - Login Google');
console.log('  - logout() - Logout');

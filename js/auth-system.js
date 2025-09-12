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
        this.loadUserFromStorage();
        this.initFirebaseAuth();
        this.updateUI();
        this.handleRedirectResult();
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
            
            let result;
            try {
                result = await signInWithPopup(auth, googleProvider);
                console.log('✅ Popup sign in successful');
            } catch (popupError) {
                console.log('⚠️ Popup failed, trying redirect:', popupError);
                if (popupError.code === 'auth/popup-blocked') {
                    await signInWithRedirect(auth, googleProvider);
                    return; // Redirect will handle the rest
                }
                throw popupError;
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
            
            if (error.code === 'auth/popup-closed-by-user') {
                message = 'Accesso annullato';
            } else if (error.code === 'auth/unauthorized-domain') {
                message = `Dominio non autorizzato: ${location.hostname}`;
                console.warn('🔧 Aggiungi questo dominio in Firebase Authentication → Domini autorizzati');
            }
            
            this.showToast(message, 'error');
        } finally {
            this.hideLoading();
        }
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
}

// Create global instance
window.authSystem = new AuthSystem();

// Expose functions globally
window.signInWithGoogle = () => window.authSystem.signInWithGoogle();
window.logout = () => window.authSystem.logout();

console.log('✅ Auth System initialized');

/**
 * Wali Wheels - Unified Authentication & Profile System
 * Sistema unificato per autenticazione e gestione profilo
 */

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '746323229250-lbmdfoccdu1peof606v45db7p6gpnmtn.apps.googleusercontent.com';
const GOOGLE_SCOPES = 'email profile';

class UnifiedAuthProfile {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.googleAuth = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.bindEvents();
        this.updateUI();
        this.initGoogleAuth();
    }

    bindEvents() {
        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Social login buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-google')) {
                this.signInWithGoogle();
            } else if (e.target.closest('.btn-microsoft')) {
                this.signInWithMicrosoft();
            }
        });

        // Google OAuth button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.social-btn.google')) {
                this.signInWithGoogle();
            } else if (e.target.closest('.social-btn.microsoft')) {
                this.signInWithMicrosoft();
            }
        });

        // Profile form
        document.getElementById('profileForm')?.addEventListener('submit', (e) => this.handleProfileUpdate(e));

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-menu')) {
                this.closeProfileDropdown();
            }
        });
    }

    // Google OAuth Initialization
    initGoogleAuth() {
        // Load Google OAuth script
        if (!window.gapi) {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.setupGoogleAuth();
            };
            document.head.appendChild(script);
        } else {
            this.setupGoogleAuth();
        }
    }

    setupGoogleAuth() {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID,
                scope: GOOGLE_SCOPES
            }).then((auth2) => {
                this.googleAuth = auth2;
                console.log('✅ Google OAuth inizializzato con successo');
            }).catch((error) => {
                console.error('❌ Errore inizializzazione Google OAuth:', error);
            });
        });
    }

    // Modal Management
    openAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            // Ensure inner auth modal becomes visible if styles require .auth-modal.active
            const authModalContent = modal.querySelector('.auth-modal');
            if (authModalContent) {
                authModalContent.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            const authModalContent = modal.querySelector('.auth-modal');
            if (authModalContent) {
                authModalContent.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        document.querySelector(`[onclick="switchAuthTab('${tab}')"]`)?.classList.add('active');
        document.getElementById(`${tab}Form`)?.classList.add('active');
    }

    // Authentication Methods
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

        try {
            this.showLoading('Accedendo...');
            await this.simulateApiCall(1000);
            
            const user = {
                id: this.generateId(),
                email: email,
                firstName: email.split('@')[0],
                lastName: 'Utente',
                name: email.split('@')[0],
                phone: '+39 123 456 789',
                address: 'Via Roma 123, Milano',
                avatar: this.generateAvatar(email),
                loginMethod: 'email',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            this.loginSuccess(user);
            this.showToast('Accesso effettuato con successo!', 'success');
            
        } catch (error) {
            this.showToast('Errore durante l\'accesso. Riprova.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

        try {
            this.showLoading('Registrazione in corso...');
            await this.simulateApiCall(1500);
            
            const user = {
                id: this.generateId(),
                email: email,
                firstName: name,
                lastName: 'Utente',
                name: name,
                phone: '+39 123 456 789',
                address: 'Via Roma 123, Milano',
                avatar: this.generateAvatar(email),
                loginMethod: 'email',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            this.loginSuccess(user);
            this.showToast('Registrazione completata con successo!', 'success');
            
        } catch (error) {
            this.showToast('Errore durante la registrazione. Riprova.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async signInWithGoogle() {
        try {
            if (!this.googleAuth) {
                throw new Error('Google OAuth non ancora inizializzato');
            }

            this.showLoading('Accesso con Google...');
            
            // Esegui il login con Google
            const googleUser = await this.googleAuth.signIn();
            const profile = googleUser.getBasicProfile();
            const authResponse = googleUser.getAuthResponse();
            
            // Crea l'utente con i dati reali di Google
            const user = {
                id: this.generateId(),
                email: profile.getEmail(),
                firstName: profile.getGivenName() || 'Utente',
                lastName: profile.getFamilyName() || 'Google',
                name: profile.getName() || 'Utente Google',
                phone: '+39 123 456 789',
                address: 'Via Roma 123, Milano',
                avatar: profile.getImageUrl() || this.generateAvatar('google'),
                loginMethod: 'google',
                googleId: profile.getId(),
                accessToken: authResponse.access_token,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            this.loginSuccess(user);
            this.showToast(`Accesso con Google completato! Benvenuto ${user.name}!`, 'success');
            
        } catch (error) {
            console.error('Errore login Google:', error);
            if (error.error === 'popup_closed_by_user') {
                this.showToast('Accesso annullato dall\'utente', 'info');
            } else {
                this.showToast('Errore durante l\'accesso con Google. Riprova.', 'error');
            }
        } finally {
            this.hideLoading();
        }
    }

    async signInWithMicrosoft() {
        try {
            this.showLoading('Accesso con Microsoft...');
            
            // Simula il login con Microsoft (per ora)
            // In futuro si può integrare con Microsoft Graph API
            await this.simulateApiCall(2000);
            
            const user = {
                id: this.generateId(),
                email: `user${this.generateId()}@outlook.com`,
                firstName: 'Utente',
                lastName: 'Microsoft',
                name: 'Utente Microsoft',
                phone: '+39 123 456 789',
                address: 'Via Roma 123, Milano',
                avatar: this.generateAvatar('microsoft'),
                loginMethod: 'microsoft',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            this.loginSuccess(user);
            this.showToast('Accesso con Microsoft completato!', 'success');
            
        } catch (error) {
            console.error('Errore login Microsoft:', error);
            this.showToast('Errore durante l\'accesso con Microsoft. Riprova.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    loginSuccess(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem('waliwheels_user', JSON.stringify(user));
        
        // Update UI
        this.updateUI();
        
        // Close modal
        this.closeAuthModal();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    logout() {
        if (confirm('Effettuare il logout?')) {
            // Logout da Google se l'utente ha fatto login con Google
            if (this.currentUser?.loginMethod === 'google' && this.googleAuth) {
                this.googleAuth.signOut().then(() => {
                    console.log('✅ Logout Google completato');
                }).catch((error) => {
                    console.error('❌ Errore logout Google:', error);
                });
            }

            this.currentUser = null;
            this.isAuthenticated = false;
            
            // Remove from localStorage
            localStorage.removeItem('waliwheels_user');
            
            // Update UI
            this.updateUI();
            
            // Show toast
            this.showToast('Logout effettuato con successo!', 'info');
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('userLoggedOut'));
        }
    }

    // Profile Management
    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedData = {};
        
        for (let [key, value] of formData.entries()) {
            updatedData[key] = value.trim();
        }

        // Validation
        if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
            this.showToast('Compila tutti i campi obbligatori', 'error');
            return;
        }

        if (!this.isValidEmail(updatedData.email)) {
            this.showToast('Email non valida', 'error');
            return;
        }

        // Update user data
        this.currentUser = { ...this.currentUser, ...updatedData };
        this.currentUser.lastUpdated = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('waliwheels_user', JSON.stringify(this.currentUser));
        
        this.showToast('Profilo aggiornato con successo! ✅', 'success');
        this.updateUI();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Profile Menu Management
    toggleProfileMenu() {
        const dropdown = document.getElementById('profileDropdown');
        const btn = document.getElementById('profileBtn');
        
        if (dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
            btn.classList.remove('active');
        } else {
            dropdown.classList.add('active');
            btn.classList.add('active');
        }
    }

    closeProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const btn = document.getElementById('profileBtn');
        
        dropdown.classList.remove('active');
        btn.classList.remove('active');
    }

    // UI Updates
    updateUI() {
        const authContainer = document.getElementById('authContainer');
        const profileMenu = document.getElementById('profileMenu');
        
        if (this.isAuthenticated && this.currentUser) {
            // Show profile menu, hide auth container
            if (profileMenu) profileMenu.style.display = 'block';
            if (authContainer) authContainer.style.display = 'none';
            
            // Update profile info
            this.updateProfileInfo();
            
            // Populate profile form if on profile page
            this.populateProfileForm();
        } else {
            // Show auth container, hide profile menu
            if (profileMenu) profileMenu.style.display = 'none';
            if (authContainer) authContainer.style.display = 'block';
        }
    }

    updateProfileInfo() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName && this.currentUser) {
            profileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
        if (profileEmail && this.currentUser) {
            profileEmail.textContent = this.currentUser.email;
        }
    }

    populateProfileForm() {
        const form = document.getElementById('profileForm');
        if (!form || !this.currentUser) return;

        const fields = ['firstName', 'lastName', 'email', 'phone', 'address'];
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input && this.currentUser[field]) {
                input.value = this.currentUser[field];
            }
        });
    }

    // Storage Management
    loadUserFromStorage() {
        const storedUser = localStorage.getItem('waliwheels_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.currentUser = user;
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error loading user from storage:', error);
                localStorage.removeItem('waliwheels_user');
            }
        }
    }

    // Utility Methods
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    generateAvatar(email) {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initial = email.charAt(0).toUpperCase();
        
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${color}"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="30">${initial}</text></svg>`;
    }

    async simulateApiCall(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    // Loading States
    showLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loading.className = 'loading-overlay';
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.remove();
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#667eea'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Profile Actions
    resetForm() {
        if (confirm('Ripristinare i dati originali?')) {
            this.populateProfileForm();
            this.showToast('Form ripristinato', 'info');
        }
    }

    changePassword() {
        const newPassword = prompt('Inserisci la nuova password:');
        if (newPassword && newPassword.length >= 6) {
            this.currentUser.password = newPassword;
            localStorage.setItem('waliwheels_user', JSON.stringify(this.currentUser));
            this.showToast('Password aggiornata con successo! 🔒', 'success');
        } else if (newPassword !== null) {
            this.showToast('La password deve essere di almeno 6 caratteri', 'error');
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.currentUser, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `waliwheels_profile_${this.currentUser.id}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Dati esportati con successo! 📁', 'success');
    }

    deleteAccount() {
        document.getElementById('deleteModal').style.display = 'flex';
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        document.getElementById('confirmEmail').value = '';
    }

    confirmDeleteAccount() {
        const confirmEmail = document.getElementById('confirmEmail').value;
        
        if (confirmEmail !== this.currentUser.email) {
            this.showToast('Email non corrisponde', 'error');
            return;
        }

        if (confirm('ATTENZIONE: Questa azione eliminerà definitivamente il tuo account. Sei assolutamente sicuro?')) {
            localStorage.removeItem('waliwheels_user');
            localStorage.removeItem('waliwheels_cars');
            
            this.showToast('Account eliminato. Reindirizzamento...', 'info');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Initialize Unified System
const unifiedSystem = new UnifiedAuthProfile();

// Global Functions for HTML onclick
function openAuthModal() {
    unifiedSystem.openAuthModal();
}

function closeAuthModal() {
    unifiedSystem.closeAuthModal();
}

function switchAuthTab(tab) {
    unifiedSystem.switchAuthTab(tab);
}

function signInWithGoogle() {
    unifiedSystem.signInWithGoogle();
}

function signInWithMicrosoft() {
    unifiedSystem.signInWithMicrosoft();
}

function toggleProfileMenu() {
    unifiedSystem.toggleProfileMenu();
}

function performLogout() {
    unifiedSystem.logout();
}

function resetForm() {
    unifiedSystem.resetForm();
}

function changePassword() {
    unifiedSystem.changePassword();
}

function exportData() {
    unifiedSystem.exportData();
}

function deleteAccount() {
    unifiedSystem.deleteAccount();
}

function closeDeleteModal() {
    unifiedSystem.closeDeleteModal();
}

function confirmDeleteAccount() {
    unifiedSystem.confirmDeleteAccount();
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add loading styles
const loadingStyles = `
<style>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-content {
    text-align: center;
    color: white;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', loadingStyles);

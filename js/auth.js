/* ===== AUTHENTICATION SYSTEM ===== */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
        this.loadUserFromStorage();
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
    }

    // Modal Management
    openAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    switchAuthTab(tab) {
        // Remove active class from all tabs and forms
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        // Add active class to selected tab and form
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
            
            // Simulate API call
            await this.simulateApiCall(1000);
            
            const user = {
                id: this.generateId(),
                email: email,
                name: email.split('@')[0],
                avatar: this.generateAvatar(email),
                loginMethod: 'email'
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
            
            // Simulate API call
            await this.simulateApiCall(1500);
            
            const user = {
                id: this.generateId(),
                email: email,
                name: name,
                avatar: this.generateAvatar(email),
                loginMethod: 'email'
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
            this.showLoading('Accesso con Google...');
            
            // Simulate Google OAuth
            await this.simulateApiCall(2000);
            
            const user = {
                id: this.generateId(),
                email: `user${this.generateId()}@gmail.com`,
                name: 'Utente Google',
                avatar: this.generateAvatar('google'),
                loginMethod: 'google'
            };

            this.loginSuccess(user);
            this.showToast('Accesso con Google completato!', 'success');
            
        } catch (error) {
            this.showToast('Errore durante l\'accesso con Google. Riprova.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async signInWithMicrosoft() {
        try {
            this.showLoading('Accesso con Microsoft...');
            
            // Simulate Microsoft OAuth
            await this.simulateApiCall(2000);
            
            const user = {
                id: this.generateId(),
                email: `user${this.generateId()}@outlook.com`,
                name: 'Utente Microsoft',
                avatar: this.generateAvatar('microsoft'),
                loginMethod: 'microsoft'
            };

            this.loginSuccess(user);
            this.showToast('Accesso con Microsoft completato!', 'success');
            
        } catch (error) {
            this.showToast('Errore durante l\'accesso con Microsoft. Riprova.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    loginSuccess(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Save to localStorage with new key
        localStorage.setItem('waliwheels_user', JSON.stringify(user));
        
        // Update UI
        this.updateAuthUI();
        
        // Close modal
        this.closeAuthModal();
        
        // Show profile menu
        this.showProfileMenu();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Remove from localStorage
        localStorage.removeItem('waliwheels_user');
        
        // Update UI
        this.updateAuthUI();
        
        // Hide profile menu
        this.hideProfileMenu();
        
        // Show toast
        this.showToast('Logout effettuato con successo!', 'info');
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // UI Updates
    updateAuthUI() {
        const authContainer = document.querySelector('.auth-container');
        if (!authContainer) return;

        if (this.isAuthenticated && this.currentUser) {
            authContainer.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar" onclick="authSystem.toggleUserMenu()">
                        <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22%23667eea%22/><text x=%2250%22 y=%2260%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2230%22>${this.currentUser.name.charAt(0).toUpperCase()}</text></svg>'">
                    </div>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-info">
                            <strong>${this.currentUser.name}</strong>
                            <span>${this.currentUser.email}</span>
                        </div>
                        <div class="user-actions">
                            <button onclick="authSystem.logout()" class="btn btn-outline">Logout</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="btn btn-outline" onclick="openAuthModal()">Accedi/Registrati</button>
            `;
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
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

    // Profile Menu Management
    showProfileMenu() {
        const profileMenu = document.getElementById('profileMenu');
        const authContainer = document.getElementById('authContainer');
        
        if (profileMenu) profileMenu.style.display = 'block';
        if (authContainer) authContainer.style.display = 'none';
        
        // Update profile info
        this.updateProfileInfo();
    }
    
    hideProfileMenu() {
        const profileMenu = document.getElementById('profileMenu');
        const authContainer = document.getElementById('authContainer');
        
        if (profileMenu) profileMenu.style.display = 'none';
        if (authContainer) authContainer.style.display = 'block';
    }
    
    updateProfileInfo() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName && this.currentUser) {
            profileName.textContent = this.currentUser.name || 'Nome Utente';
        }
        if (profileEmail && this.currentUser) {
            profileEmail.textContent = this.currentUser.email || 'email@example.com';
        }
    }
    
    // Storage Management
    loadUserFromStorage() {
        const storedUser = localStorage.getItem('waliwheels_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.currentUser = user;
                this.isAuthenticated = true;
                this.updateAuthUI();
                this.showProfileMenu();
            } catch (error) {
                console.error('Error loading user from storage:', error);
                localStorage.removeItem('waliwheels_user');
            }
        }
    }

    // Loading States
    showLoading(message) {
        // Create loading overlay
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
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Add to toast container
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    // Auth Status Check
    checkAuthStatus() {
        return this.isAuthenticated;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize Auth System
const authSystem = new AuthSystem();

// Global Functions for HTML onclick
function openAuthModal() {
    authSystem.openAuthModal();
}

function closeAuthModal() {
    authSystem.closeAuthModal();
}

function switchAuthTab(tab) {
    authSystem.switchAuthTab(tab);
}

function signInWithGoogle() {
    authSystem.signInWithGoogle();
}

function signInWithMicrosoft() {
    authSystem.signInWithMicrosoft();
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close user dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
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

.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
}

.toast {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    margin-bottom: 15px;
    overflow: hidden;
    animation: toastSlideIn 0.3s ease;
}

@keyframes toastSlideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.toast-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
}

.toast-message {
    flex: 1;
    margin-right: 15px;
}

.toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #718096;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.toast-close:hover {
    background: #f7fafc;
    color: #1a202c;
}

.toast-success {
    border-left: 4px solid #48bb78;
}

.toast-error {
    border-left: 4px solid #f56565;
}

.toast-info {
    border-left: 4px solid #4299e1;
}

.user-menu {
    position: relative;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.user-avatar:hover {
    border-color: #667eea;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    min-width: 250px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
}

.user-dropdown.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.user-info {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.user-info strong {
    display: block;
    color: #1a202c;
    margin-bottom: 5px;
}

.user-info span {
    color: #718096;
    font-size: 0.9rem;
}

.user-actions {
    padding: 20px;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', loadingStyles);

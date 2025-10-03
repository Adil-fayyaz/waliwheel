// ===== GOOGLE AUTH SYSTEM =====

class GoogleAuthSystem {
    constructor() {
        this.user = null;
        this.authButton = null;
        this.profileMenu = null;
        this.mobileAuthButton = null;
        
        this.init();
    }
    
    async init() {
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            await this.loadFirebaseSDK();
        }
        
        this.setupAuthElements();
        this.setupEventListeners();
        this.checkAuthState();
    }
    
    async loadFirebaseSDK() {
        // Load Firebase SDK dynamically
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
            script.onload = () => {
                const authScript = document.createElement('script');
                authScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
                authScript.onload = () => {
                    const firestoreScript = document.createElement('script');
                    firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js';
                    firestoreScript.onload = resolve;
                    document.head.appendChild(firestoreScript);
                };
                document.head.appendChild(authScript);
            };
            document.head.appendChild(script);
        });
    }
    
    setupAuthElements() {
        this.authButton = document.getElementById('authBtn');
        this.mobileAuthButton = document.getElementById('mobileAuthBtn');
        this.profileMenu = document.getElementById('profileMenu');
        this.profileBtn = document.getElementById('profileBtn');
        this.profileName = document.getElementById('profileName');
        this.profileEmail = document.getElementById('profileEmail');
    }
    
    setupEventListeners() {
        if (this.authButton) {
            this.authButton.addEventListener('click', () => this.handleAuthClick());
        }
        
        if (this.mobileAuthButton) {
            this.mobileAuthButton.addEventListener('click', () => this.handleAuthClick());
        }
        
        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', () => this.toggleProfileDropdown());
        }
        
        // Close profile dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.profileMenu && !this.profileMenu.contains(e.target)) {
                this.hideProfileDropdown();
            }
        });
    }
    
    async checkAuthState() {
        try {
            // Initialize Firebase if not already done
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey: "AIzaSyDt8gG0H0m-00m5qk71cpV411BFvs1jzQ0",
                    authDomain: "autromotive.firebaseapp.com",
                    projectId: "autromotive",
                    storageBucket: "autromotive.firebasestorage.app",
                    messagingSenderId: "605267968435",
                    appId: "1:605267968435:web:a6125a79c7a5d9e6720bc6",
                    measurementId: "G-VF1F027LHJ"
                });
            }
            
            // Listen for auth state changes
            firebase.auth().onAuthStateChanged((user) => {
                this.user = user;
                this.updateUI(user);
            });
            
            // Check for stored user data
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
                this.updateUI(this.user);
            }
            
        } catch (error) {
            console.error('Error checking auth state:', error);
        }
    }
    
    async handleAuthClick() {
        if (this.user) {
            await this.signOut();
        } else {
            await this.signInWithGoogle();
        }
    }
    
    async signInWithGoogle() {
        try {
            this.showLoadingState();
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;
            
            // Store user data
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            this.user = userData;
            
            this.showNotification('Benvenuto! Accesso effettuato con successo', 'success');
            this.updateUI(userData);
            
        } catch (error) {
            console.error('Error signing in:', error);
            this.showNotification('Errore durante l\'accesso. Riprova.', 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    async signOut() {
        try {
            this.showLoadingState();
            
            await firebase.auth().signOut();
            localStorage.removeItem('user');
            this.user = null;
            
            this.showNotification('Logout effettuato con successo', 'info');
            this.updateUI(null);
            
        } catch (error) {
            console.error('Error signing out:', error);
            this.showNotification('Errore durante il logout', 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    updateUI(user) {
        if (user) {
            // User is signed in
            this.showProfileMenu(user);
            this.hideAuthButton();
        } else {
            // User is signed out
            this.hideProfileMenu();
            this.showAuthButton();
        }
    }
    
    showAuthButton() {
        if (this.authButton) {
            this.authButton.style.display = 'flex';
            this.authButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                </svg>
                <span>Accedi</span>
            `;
        }
        
        if (this.mobileAuthButton) {
            this.mobileAuthButton.style.display = 'flex';
            this.mobileAuthButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                </svg>
                <span>Accedi</span>
            `;
        }
    }
    
    hideAuthButton() {
        if (this.authButton) {
            this.authButton.style.display = 'none';
        }
        
        if (this.mobileAuthButton) {
            this.mobileAuthButton.style.display = 'none';
        }
    }
    
    showProfileMenu(user) {
        if (this.profileMenu) {
            this.profileMenu.style.display = 'block';
            
            if (this.profileName) {
                this.profileName.textContent = user.displayName || 'Utente';
            }
            
            if (this.profileEmail) {
                this.profileEmail.textContent = user.email || '';
            }
            
            // Update profile button
            if (this.profileBtn) {
                this.profileBtn.innerHTML = `
                    <img src="${user.photoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIxIDEyIDE2IDEwLjIxIDE2IDhDMTYgNS43OSAxNC4yMSA0IDEyIDRDOS43OSA0IDggNS43OSA4IDhDOCAxMC4yMSA5Ljc5IDEyIDEyIDEyWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGQ9Ik0xMiAxNEMxNi40MiAxNCAyMCAxNy41OCAyMCAyMkg0QzQgMTcuNTggNy41OCAxNCAxMiAxNFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L3N2Zz4K'}" 
                         alt="Profile" 
                         style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                    <span>Profilo</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                `;
            }
        }
    }
    
    hideProfileMenu() {
        if (this.profileMenu) {
            this.profileMenu.style.display = 'none';
        }
    }
    
    toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                // Animate in
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                
                requestAnimationFrame(() => {
                    dropdown.style.transition = 'all 0.3s ease';
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                });
            }
        }
    }
    
    hideProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    showLoadingState() {
        if (this.authButton) {
            this.authButton.disabled = true;
            this.authButton.innerHTML = `
                <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #00ff88; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>Caricamento...</span>
            `;
        }
        
        if (this.mobileAuthButton) {
            this.mobileAuthButton.disabled = true;
            this.mobileAuthButton.innerHTML = `
                <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #00ff88; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>Caricamento...</span>
            `;
        }
    }
    
    hideLoadingState() {
        if (this.authButton) {
            this.authButton.disabled = false;
        }
        
        if (this.mobileAuthButton) {
            this.mobileAuthButton.disabled = false;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 
                       type === 'error' ? 'rgba(255, 107, 107, 0.9)' : 
                       'rgba(102, 126, 234, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize Google Auth System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.googleAuth = new GoogleAuthSystem();
});

// Add spin animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

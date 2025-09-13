(function() {
    // Inject modal HTML
    function injectAuthModal() {
        if (document.getElementById('globalAuthModal')) return;

        const modal = document.createElement('div');
        modal.id = 'globalAuthModal';
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
            <div class="auth-modal-box">
                <div class="auth-modal-header">
                    <h2 class="auth-modal-title">🔒 Benvenuto</h2>
                    <button class="auth-close-btn" aria-label="Chiudi" data-auth-close>✕</button>
                </div>
                <div class="auth-modal-body">
                    <div class="auth-tabs">
                        <div class="auth-tab active-login" data-auth-tab="login">Accedi</div>
                        <div class="auth-tab" data-auth-tab="signup">Registrati</div>
                    </div>

                    <form id="globalLoginForm" class="auth-form active">
                        <div class="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="tu@esempio.com" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input name="password" type="password" placeholder="La tua password" required>
                        </div>
                        <button type="submit" class="auth-submit">Accedi</button>
                    </form>

                    <form id="globalSignupForm" class="auth-form">
                        <div class="form-group">
                            <label>Nome</label>
                            <input name="name" type="text" placeholder="Es. Adil" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="tu@esempio.com" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input name="password" type="password" placeholder="Crea una password" required>
                        </div>
                        <button type="submit" class="auth-submit">Crea account</button>
                    </form>

                    <div class="auth-socials">
                        <p>oppure continua con</p>
                        <div class="auth-social-buttons">
                            <button type="button" data-auth-google>Google</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Hide legacy page-specific modals to avoid duplicates
        document.querySelectorAll('#authModal.modal-overlay').forEach(function(el) {
            el.style.display = 'none';
        });
    }

    function openModal() {
        const overlay = document.getElementById('globalAuthModal');
        if (!overlay) return;
        overlay.classList.add('active');
        document.body.classList.add('auth-modal-open');
    }

    function closeModal() {
        const overlay = document.getElementById('globalAuthModal');
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.classList.remove('auth-modal-open');
    }

    function bindModalEvents() {
        const overlay = document.getElementById('globalAuthModal');
        if (!overlay) return;

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });

        // Close button
        overlay.querySelector('[data-auth-close]')?.addEventListener('click', closeModal);

        // Tabs
        const tabLogin = overlay.querySelector('[data-auth-tab="login"]');
        const tabSignup = overlay.querySelector('[data-auth-tab="signup"]');
        const loginForm = document.getElementById('globalLoginForm');
        const signupForm = document.getElementById('globalSignupForm');

        tabLogin?.addEventListener('click', function() {
            tabLogin.classList.add('active-login');
            tabSignup.classList.remove('active-signup');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });

        tabSignup?.addEventListener('click', function() {
            tabSignup.classList.add('active-signup');
            tabLogin.classList.remove('active-login');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });

        // Forms integration with unified system if available
        loginForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            if (window.unifiedSystem && typeof window.unifiedSystem.handleLogin === 'function') {
                window.unifiedSystem.handleLogin(e);
            } else if (window.authSystem && typeof window.authSystem.handleLogin === 'function') {
                window.authSystem.handleLogin(e);
            }
        });

        signupForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            if (window.unifiedSystem && typeof window.unifiedSystem.handleRegister === 'function') {
                window.unifiedSystem.handleRegister(e);
            } else if (window.authSystem && typeof window.authSystem.handleRegister === 'function') {
                window.authSystem.handleRegister(e);
            }
        });

        // Socials
        overlay.querySelector('[data-auth-google]')?.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 Google button clicked!');
            
            // Wait a bit for modules to load
            setTimeout(() => {
                // Try multiple approaches
                if (window.signInWithGoogle) {
                    console.log('🔥 Using window.signInWithGoogle');
                    window.signInWithGoogle();
                } else if (window.unifiedSystem && typeof window.unifiedSystem.signInWithGoogle === 'function') {
                    console.log('🔥 Using unifiedSystem.signInWithGoogle');
                    window.unifiedSystem.signInWithGoogle();
                } else if (window.firebaseAuth) {
                    console.log('🔥 Using direct Firebase');
                    const { auth, googleProvider, signInWithPopup } = window.firebaseAuth;
                    signInWithPopup(auth, googleProvider).then((result) => {
                        console.log('✅ Firebase login success:', result);
                        // Close modal
                        closeModal();
                    }).catch((error) => {
                        console.error('❌ Firebase login error:', error);
                        alert('Errore login Google: ' + error.message);
                    });
                } else {
                    console.error('❌ No auth method available');
                    alert('Sistema di autenticazione non disponibile. Ricarica la pagina.');
                }
            }, 100);
        });

        // (Rimosso) Pulsante Waliwheel non utilizzato
    }

    function ensureAuthButton() {
        // Insert glow CTA button into .auth-container or .nav-actions if present
        const containers = [];
        const authContainer = document.getElementById('authContainer');
        if (authContainer) containers.push(authContainer);
        const navActions = document.querySelectorAll('.nav-actions');
        navActions.forEach(function(na) { containers.push(na); });

        containers.forEach(function(container) {
            if (!container) return;
            
             // Check if user is already logged in
             const storedUser = localStorage.getItem('waliwheels_user');
             let isLoggedIn = false;
             
             try {
                 const userData = storedUser ? JSON.parse(storedUser) : null;
                 isLoggedIn = userData && (userData.email || userData.uid);
                 console.log('🔍 Auth check - storedUser:', storedUser, 'isLoggedIn:', isLoggedIn);
             } catch (e) {
                 console.error('Error parsing user data:', e);
                 isLoggedIn = false;
             }
            
            if (isLoggedIn) {
                console.log('✅ User is logged in, showing profile button');
                // Remove existing auth button
                const existingAuth = container.querySelector('.glow-cta');
                if (existingAuth) existingAuth.remove();
                
                // Show profile button instead
                ensureProfileButton(container);
            } else {
                console.log('❌ User is not logged in, showing auth button');
                // Remove existing profile button
                const existingProfile = container.querySelector('.profile-button-wrapper');
                if (existingProfile) existingProfile.remove();
                
                // Show auth button
                const existing = container.querySelector('.glow-cta');
                if (existing) return;

                const wrapper = document.createElement('div');
                wrapper.className = 'glow-cta';
                wrapper.innerHTML = '<button type="button" id="openAuthModalBtn">Accedi / Registrati ✨</button>';
                container.prepend(wrapper);

                wrapper.querySelector('#openAuthModalBtn')?.addEventListener('click', openModal);
            }
        });
    }

    function ensureProfileButton(container) {
        const existing = container.querySelector('.profile-button-wrapper');
        if (existing) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'profile-button-wrapper';
        wrapper.innerHTML = `
            <div class="profile-button" id="profileButton">
                <div class="profile-avatar">
                    <img src="${getUserAvatar()}" alt="Profile" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="avatar-fallback" style="display:none;">👤</div>
                </div>
                <div class="profile-info">
                    <span class="profile-name">${getUserName()}</span>
                    <span class="profile-email">${getUserEmail()}</span>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <a href="profilo.html" class="profile-link">👤 Il Mio Profilo</a>
                    <a href="#" class="profile-link" onclick="logout()">🚪 Logout</a>
                </div>
            </div>
        `;
        container.prepend(wrapper);

        // Add click handler for profile button
        const profileBtn = wrapper.querySelector('#profileButton');
        profileBtn?.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = wrapper.querySelector('#profileDropdown');
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                wrapper.querySelector('#profileDropdown').classList.remove('active');
            }
        });
    }

    function getUserAvatar() {
        try {
            const user = JSON.parse(localStorage.getItem('waliwheels_user'));
            return user?.photoURL || user?.avatar || '';
        } catch {
            return '';
        }
    }

    function getUserName() {
        try {
            const user = JSON.parse(localStorage.getItem('waliwheels_user'));
            return user?.displayName || user?.name || 'Utente';
        } catch {
            return 'Utente';
        }
    }

    function getUserEmail() {
        try {
            const user = JSON.parse(localStorage.getItem('waliwheels_user'));
            return user?.email || '';
        } catch {
            return '';
        }
    }

     // Force UI update function
     window.updateAuthUI = function() {
         console.log('🔄 Force updating auth UI...');
         ensureAuthButton();
     };

     // Test function to simulate login
     window.testLogin = function() {
         const testUser = {
             uid: 'test123',
             email: 'test@example.com',
             displayName: 'Test User',
             photoURL: 'https://via.placeholder.com/40',
             name: 'Test User'
         };
         localStorage.setItem('waliwheels_user', JSON.stringify(testUser));
         window.updateAuthUI();
         console.log('✅ Test login applied');
     };

     // Test function to simulate logout
     window.testLogout = function() {
         localStorage.removeItem('waliwheels_user');
         window.updateAuthUI();
         console.log('✅ Test logout applied');
     };

     // Public global bindings to keep compatibility
     window.openAuthModal = openModal;
     window.closeAuthModal = closeModal;

    // Initialize when DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        injectAuthModal();
        bindModalEvents();
        ensureAuthButton();
    });

    // Also ensure after unified system initializes UI (e.g., toggling profile/auth containers)
    window.addEventListener('userLoggedIn', function() {
        // Clear existing buttons and show profile
        document.querySelectorAll('.glow-cta').forEach(el => el.remove());
        ensureAuthButton();
    });
    
    window.addEventListener('userLoggedOut', function() {
        // Clear existing profile and show auth button
        document.querySelectorAll('.profile-button-wrapper').forEach(el => el.remove());
        ensureAuthButton();
    });
})();



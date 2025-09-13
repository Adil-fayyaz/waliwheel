/**
 * Wali Wheels - Auth Modal with Profile Button
 * Modal di autenticazione con pulsante profilo
 */

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
                            <button type="button" data-auth-google>🔍 Google</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
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

        // Google button
        overlay.querySelector('[data-auth-google]')?.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 Google button clicked!');
            
            if (window.signInWithGoogle) {
                window.signInWithGoogle();
            } else {
                alert('Sistema di autenticazione non disponibile');
            }
        });

        
    }

    function ensureAuthButton() {
        console.log('🔄 Ensuring auth button...');
        
        const containers = [];
        const authContainer = document.getElementById('authContainer');
        if (authContainer) containers.push(authContainer);
        const navActions = document.querySelectorAll('.nav-actions');
        navActions.forEach(function(na) { containers.push(na); });

        containers.forEach(function(container) {
            if (!container) return;
            
            // Clear existing buttons
            container.querySelectorAll('.glow-cta, .profile-button-wrapper').forEach(el => el.remove());
            
            // Check if user is logged in
            const isLoggedIn = checkUserLoggedIn();
            console.log('🔍 User logged in:', isLoggedIn);
            
            if (isLoggedIn) {
                showProfileButton(container);
            } else {
                showAuthButton(container);
            }
        });
    }

    function checkUserLoggedIn() {
        try {
            const stored = localStorage.getItem('waliwheels_user');
            if (!stored) return false;
            
            const userData = JSON.parse(stored);
            return userData && (userData.email || userData.uid);
        } catch {
            return false;
        }
    }

    function showAuthButton(container) {
        console.log('✅ Showing auth button');
        
        const wrapper = document.createElement('div');
        wrapper.className = 'glow-cta';
        wrapper.innerHTML = '<button type="button" id="openAuthModalBtn">Accedi / Registrati ✨</button>';
        container.prepend(wrapper);

        wrapper.querySelector('#openAuthModalBtn')?.addEventListener('click', openModal);
    }

    function showProfileButton(container) {
        console.log('✅ Showing profile button');
        
        const user = getUserData();
        const wrapper = document.createElement('div');
        wrapper.className = 'profile-button-wrapper';
        wrapper.innerHTML = `
            <div class="profile-button" id="profileButton">
                <div class="profile-avatar">
                    <img src="${user.photoURL || ''}" alt="Profile" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="avatar-fallback" style="display:none;">👤</div>
                </div>
                <div class="profile-info">
                    <span class="profile-name">${user.name || 'Utente'}</span>
                    <span class="profile-email">${user.email || ''}</span>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <a href="profilo.html" class="profile-link">👤 Il Mio Profilo</a>
                    <a href="#" class="profile-link" onclick="logout()">🚪 Logout</a>
                </div>
            </div>
        `;
        container.prepend(wrapper);

        // Add click handler
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

    function getUserData() {
        try {
            const stored = localStorage.getItem('waliwheels_user');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    // Public functions
    window.openAuthModal = openModal;
    window.closeAuthModal = closeModal;
    window.updateAuthUI = ensureAuthButton;

    // Test functions
    window.testLogin = function() {
        const testUser = {
            uid: 'test123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://via.placeholder.com/40',
            name: 'Test User'
        };
        localStorage.setItem('waliwheels_user', JSON.stringify(testUser));
        ensureAuthButton();
        console.log('✅ Test login applied');
    };

    window.testLogout = function() {
        localStorage.removeItem('waliwheels_user');
        ensureAuthButton();
        console.log('✅ Test logout applied');
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        injectAuthModal();
        bindModalEvents();
        ensureAuthButton();
    });

    // Listen for auth changes
    window.addEventListener('userLoggedIn', function() {
        console.log('🎉 User logged in event received');
        ensureAuthButton();
    });
    
    window.addEventListener('userLoggedOut', function() {
        console.log('👋 User logged out event received');
        ensureAuthButton();
    });

    console.log('✅ Auth Modal initialized');
})();

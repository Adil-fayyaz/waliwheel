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
                            <button type="button" data-auth-wali>Waliwheel</button>
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
        overlay.querySelector('[data-auth-google]')?.addEventListener('click', function() {
            if (window.signInWithGoogle) {
                window.signInWithGoogle();
            } else if (window.unifiedSystem && typeof window.unifiedSystem.signInWithGoogle === 'function') {
                window.unifiedSystem.signInWithGoogle();
            }
        });

        overlay.querySelector('[data-auth-wali]')?.addEventListener('click', function() {
            alert('Login con Waliwheel');
        });
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
            const existing = container.querySelector('.glow-cta');
            const profileVisible = document.getElementById('profileMenu') && getComputedStyle(document.getElementById('profileMenu')).display !== 'none';
            if (existing || profileVisible) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'glow-cta';
            wrapper.innerHTML = '<button type="button" id="openAuthModalBtn">Accedi / Registrati ✨</button>';
            container.prepend(wrapper);

            wrapper.querySelector('#openAuthModalBtn')?.addEventListener('click', openModal);
        });
    }

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
    window.addEventListener('userLoggedIn', ensureAuthButton);
    window.addEventListener('userLoggedOut', ensureAuthButton);
})();



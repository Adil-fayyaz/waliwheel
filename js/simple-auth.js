// Gestione semplice dei pulsanti Accedi e Registrati
(function() {
    function createAuthButtons() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        // Crea i pulsanti semplici
        const authHTML = `
            <div class="auth-buttons-simple">
                <button class="btn-login glass-button primary" onclick="openLoginModal()">
                    Accedi
                </button>
                <button class="btn-register glass-button secondary" onclick="openRegisterModal()">
                    Registrati
                </button>
            </div>
        `;

        authContainer.innerHTML = authHTML;
    }

    function createAuthModal() {
        const modalHTML = `
            <div id="simpleAuthModal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Accedi</h3>
                        <button class="modal-close" onclick="closeAuthModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="loginForm" class="auth-form" style="display: block;">
                            <button class="google-login-btn glass-button primary" onclick="signInWithGoogle()">
                                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 10px;">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Accedi con Google
                            </button>
                        </div>
                        <div id="registerForm" class="auth-form" style="display: none;">
                            <button class="google-register-btn glass-button primary" onclick="signInWithGoogle()">
                                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 10px;">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Registrati con Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Funzioni globali per aprire/chiudere modal
    window.openLoginModal = function() {
        const modal = document.getElementById('simpleAuthModal');
        const title = document.getElementById('modalTitle');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (modal && title && loginForm && registerForm) {
            title.textContent = 'Accedi';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            modal.style.display = 'flex';
        }
    };

    window.openRegisterModal = function() {
        const modal = document.getElementById('simpleAuthModal');
        const title = document.getElementById('modalTitle');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (modal && title && loginForm && registerForm) {
            title.textContent = 'Registrati';
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            modal.style.display = 'flex';
        }
    };

    window.closeAuthModal = function() {
        const modal = document.getElementById('simpleAuthModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Inizializza quando il DOM è pronto
    document.addEventListener('DOMContentLoaded', function() {
        createAuthButtons();
        createAuthModal();
        
        // Chiudi modal cliccando fuori
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('simpleAuthModal');
            if (e.target === modal) {
                closeAuthModal();
            }
        });
    });
})();

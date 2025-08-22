// AutoShop Premium - Configurazione Autenticazione Google OAuth

const GOOGLE_AUTH_CONFIG = {
    // Configurazione Google OAuth 2.0
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    
    // URL di reindirizzamento autorizzati
    redirectUri: window.location.origin + '/auth/callback',
    
    // Scope richiesti
    scope: [
        'openid',
        'profile',
        'email'
    ].join(' '),
    
    // Endpoint Google OAuth
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    
    // Configurazione reCAPTCHA v3
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY',
    recaptchaSecretKey: 'YOUR_RECAPTCHA_SECRET_KEY',
    
    // Configurazione Stripe (per i pagamenti)
    stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
    stripeSecretKey: 'sk_test_YOUR_STRIPE_SECRET_KEY',
    
    // Configurazione Firebase (opzionale per autenticazione avanzata)
    firebaseConfig: {
        apiKey: 'YOUR_FIREBASE_API_KEY',
        authDomain: 'your-project.firebaseapp.com',
        projectId: 'your-project-id',
        storageBucket: 'your-project.appspot.com',
        messagingSenderId: '123456789',
        appId: 'your-app-id'
    }
};

// Configurazione per ambiente di sviluppo
const DEV_CONFIG = {
    ...GOOGLE_AUTH_CONFIG,
    redirectUri: 'http://localhost:3000/auth/callback',
    apiBaseUrl: 'http://localhost:3000/api'
};

// Configurazione per ambiente di produzione
const PROD_CONFIG = {
    ...GOOGLE_AUTH_CONFIG,
    redirectUri: 'https://yourdomain.com/auth/callback',
    apiBaseUrl: 'https://yourdomain.com/api'
};

// Esporta la configurazione appropriata
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const AUTH_CONFIG = isDevelopment ? DEV_CONFIG : PROD_CONFIG;

// Funzioni di utilità per l'autenticazione
const AuthUtils = {
    // Genera URL di autorizzazione Google
    generateGoogleAuthUrl: () => {
        const params = new URLSearchParams({
            client_id: AUTH_CONFIG.clientId,
            redirect_uri: AUTH_CONFIG.redirectUri,
            scope: AUTH_CONFIG.scope,
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent'
        });
        
        return `${AUTH_CONFIG.authUrl}?${params.toString()}`;
    },
    
    // Gestisce il callback di Google OAuth
    handleGoogleCallback: async (code) => {
        try {
            const response = await fetch('/api/auth/google/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            if (!response.ok) {
                throw new Error('Errore durante l\'autenticazione');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Errore callback Google:', error);
            throw error;
        }
    },
    
    // Verifica token JWT
    verifyToken: async (token) => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Token non valido');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Errore verifica token:', error);
            throw error;
        }
    },
    
    // Aggiorna token di accesso
    refreshToken: async (refreshToken) => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (!response.ok) {
                throw new Error('Errore durante il refresh del token');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Errore refresh token:', error);
            throw error;
        }
    },
    
    // Logout
    logout: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            
            // Rimuovi token locali
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            // Reindirizza alla home
            window.location.href = '/';
        } catch (error) {
            console.error('Errore durante il logout:', error);
            // Forza la rimozione dei token anche in caso di errore
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    },
    
    // Gestisce errori di autenticazione
    handleAuthError: (error) => {
        console.error('Errore di autenticazione:', error);
        
        if (error.status === 401) {
            // Token scaduto, prova a fare refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                return AuthUtils.refreshToken(refreshToken);
            } else {
                // Nessun refresh token, reindirizza al login
                AuthUtils.logout();
                return null;
            }
        }
        
        // Altri errori
        throw error;
    }
};

// Configurazione reCAPTCHA
const RecaptchaConfig = {
    siteKey: AUTH_CONFIG.recaptchaSiteKey,
    
    // Inizializza reCAPTCHA
    init: () => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(() => {
                console.log('reCAPTCHA inizializzato');
            });
        }
    },
    
    // Esegue verifica reCAPTCHA
    execute: async (action = 'submit') => {
        try {
            const token = await grecaptcha.execute(AUTH_CONFIG.recaptchaSiteKey, { action });
            return token;
        } catch (error) {
            console.error('Errore reCAPTCHA:', error);
            throw error;
        }
    }
};

// Configurazione Stripe
const StripeConfig = {
    publicKey: AUTH_CONFIG.stripePublicKey,
    
    // Inizializza Stripe
    init: () => {
        if (typeof Stripe !== 'undefined') {
            return Stripe(AUTH_CONFIG.stripePublicKey);
        }
        return null;
    },
    
    // Crea elemento di pagamento
    createPaymentElement: (stripe, options = {}) => {
        const elements = stripe.elements();
        return elements.create('payment', options);
    },
    
    // Conferma pagamento
    confirmPayment: async (stripe, clientSecret, paymentElement) => {
        try {
            const result = await stripe.confirmPayment({
                elements: paymentElement,
                confirmParams: {
                    return_url: window.location.origin + '/payment/success'
                }
            });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
            
            return result;
        } catch (error) {
            console.error('Errore conferma pagamento:', error);
            throw error;
        }
    }
};

// Esporta configurazioni e utility
window.AUTH_CONFIG = AUTH_CONFIG;
window.AuthUtils = AuthUtils;
window.RecaptchaConfig = RecaptchaConfig;
window.StripeConfig = StripeConfig;

// Inizializza configurazioni quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza reCAPTCHA se disponibile
    if (typeof grecaptcha !== 'undefined') {
        RecaptchaConfig.init();
    }
    
    // Inizializza Stripe se disponibile
    if (typeof Stripe !== 'undefined') {
        StripeConfig.init();
    }
    
    console.log('🔐 Configurazione autenticazione inizializzata');
});

// Esporta per moduli ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AUTH_CONFIG,
        AuthUtils,
        RecaptchaConfig,
        StripeConfig
    };
}

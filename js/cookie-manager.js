class CookieManager {
    constructor() {
        this.cookieConsent = null;
        this.init();
    }

    init() {
        this.createCookieBanner();
        this.checkCookieConsent();
        this.setupEventListeners();
    }

    createCookieBanner() {
        // Rimuovi banner esistenti
        const existingBanner = document.querySelector('.cookie-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h3>🍪 Utilizziamo i cookie</h3>
                    <p>Utilizziamo i cookie per migliorare la tua esperienza. Continuando a navigare accetti la nostra Cookie Policy.</p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-accept glass-button primary" id="acceptCookies">
                        <span class="button-text">Accetta</span>
                        <span class="button-icon">✓</span>
                    </button>
                    <button class="cookie-decline glass-button secondary" id="declineCookies">
                        <span class="button-text">Rifiuta</span>
                        <span class="button-icon">✗</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        this.cookieConsent = banner;
    }

    setupEventListeners() {
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptCookies());
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineCookies());
        }
    }

    acceptCookies() {
        // Salva consenso
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        
        // Nascondi banner con animazione
        this.hideCookieBanner();
        
        // Mostra conferma
        this.showToast('✅ Cookie accettati! Grazie per la tua preferenza.', 'success');
        
        // Abilita funzionalità che richiedono cookie
        this.enableCookieFeatures();
    }

    declineCookies() {
        // Salva rifiuto
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        
        // Nascondi banner
        this.hideCookieBanner();
        
        // Mostra conferma
        this.showToast('ℹ️ Cookie rifiutati. Alcune funzionalità potrebbero non essere disponibili.', 'info');
        
        // Disabilita funzionalità che richiedono cookie
        this.disableCookieFeatures();
    }

    hideCookieBanner() {
        if (this.cookieConsent) {
            this.cookieConsent.style.opacity = '0';
            this.cookieConsent.style.transform = 'translateY(-100%)';
            
            setTimeout(() => {
                this.cookieConsent.style.display = 'none';
            }, 300);
        }
    }

    checkCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        const consentDate = localStorage.getItem('cookieConsentDate');
        
        if (consent === 'accepted') {
            // Cookie già accettati, nascondi banner
            this.hideCookieBanner();
            this.enableCookieFeatures();
        } else if (consent === 'declined') {
            // Cookie rifiutati, nascondi banner
            this.hideCookieBanner();
            this.disableCookieFeatures();
        } else {
            // Nessun consenso, mostra banner
            this.showCookieBanner();
        }
    }

    showCookieBanner() {
        if (this.cookieConsent) {
            this.cookieConsent.style.display = 'flex';
            setTimeout(() => {
                this.cookieConsent.style.opacity = '1';
                this.cookieConsent.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    enableCookieFeatures() {
        // Abilita funzionalità che richiedono cookie
        document.body.classList.add('cookies-enabled');
        
        // Abilita analytics, tracking, etc.
        this.enableAnalytics();
    }

    disableCookieFeatures() {
        // Disabilita funzionalità che richiedono cookie
        document.body.classList.remove('cookies-enabled');
        
        // Disabilita analytics, tracking, etc.
        this.disableAnalytics();
    }

    enableAnalytics() {
        // Placeholder per Google Analytics o altri servizi
        console.log('📊 Analytics abilitati - Cookie accettati');
    }

    disableAnalytics() {
        // Placeholder per disabilitare analytics
        console.log('📊 Analytics disabilitati - Cookie rifiutati');
    }

    showToast(message, type = 'info') {
        // Sistema toast semplice
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Metodi pubblici per controllo esterno
    isConsentGiven() {
        return localStorage.getItem('cookieConsent') === 'accepted';
    }

    getConsentDate() {
        return localStorage.getItem('cookieConsentDate');
    }

    resetConsent() {
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookieConsentDate');
        this.showCookieBanner();
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});














// Profile Manager - Gestione completa dei modali profilo
// Versione: 2.0.0

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.modals = {};
        this.init();
    }

    init() {
        console.log('🚀 Profile Manager inizializzato');
        this.setupModals();
        this.setupEventListeners();
        this.loadUserProfile();
    }

    setupModals() {
        // Inizializza tutti i modali
        this.modals = {
            profile: document.getElementById('profileModal'),
            password: document.getElementById('passwordModal'),
            settings: document.getElementById('settingsModal')
        };

        // Verifica che tutti i modali esistano
        Object.entries(this.modals).forEach(([name, modal]) => {
            if (!modal) {
                console.error(`❌ Modale ${name} non trovato`);
            }
        });
    }

    setupEventListeners() {
        // Eventi per aprire modali
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="profile"]')) {
                this.openProfileModal();
            } else if (e.target.closest('[data-action="settings"]')) {
                this.openSettingsModal();
            }
        });

        // Eventi per chiudere modali
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('profile-modal-close') || 
                e.target.classList.contains('password-modal-close') ||
                e.target.classList.contains('settings-modal-close')) {
                this.closeAllModals();
            }
        });

        // Eventi per pulsanti specifici
        this.setupSpecificEventListeners();

        // Chiusura modali con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Chiusura modali cliccando fuori
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('profile-modal') ||
                e.target.classList.contains('password-modal') ||
                e.target.classList.contains('settings-modal')) {
                this.closeAllModals();
            }
        });
    }

    setupSpecificEventListeners() {
        // Cambio password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.openPasswordModal());
        }

        const confirmPasswordChangeBtn = document.getElementById('confirmPasswordChangeBtn');
        if (confirmPasswordChangeBtn) {
            confirmPasswordChangeBtn.addEventListener('click', () => this.handlePasswordChange());
        }

        // Salvataggio profilo
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        const saveAddressBtn = document.getElementById('saveAddressBtn');
        if (saveAddressBtn) {
            saveAddressBtn.addEventListener('click', () => this.saveAddress());
        }

        const savePreferencesBtn = document.getElementById('savePreferencesBtn');
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', () => this.savePreferences());
        }

        // Salvataggio impostazioni
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Gestione password strength
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Gestione 2FA
        const toggle2FABtn = document.getElementById('toggle2FABtn');
        if (toggle2FABtn) {
            toggle2FABtn.addEventListener('click', () => this.toggle2FA());
        }

        // Logout da tutti i dispositivi
        const logoutAllBtn = document.getElementById('logoutAllBtn');
        if (logoutAllBtn) {
            logoutAllBtn.addEventListener('click', () => this.logoutAllDevices());
        }
    }

    openProfileModal() {
        if (this.modals.profile) {
            this.modals.profile.classList.add('active');
            this.populateProfileForm();
            this.showNotification('👤 Profilo aperto', 'info');
        }
    }

    openPasswordModal() {
        if (this.modals.password) {
            this.modals.password.classList.add('active');
            this.showNotification('🔑 Modifica password', 'info');
        }
    }

    openSettingsModal() {
        if (this.modals.settings) {
            this.modals.settings.classList.add('active');
            this.populateSettingsForm();
            this.showNotification('⚙️ Impostazioni aperte', 'info');
        }
    }

    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }

    loadUserProfile() {
        // Carica profilo utente da localStorage
        const userData = localStorage.getItem('demoUserData');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('👤 Profilo utente caricato:', this.currentUser);
            } catch (error) {
                console.error('❌ Errore caricamento profilo:', error);
            }
        }
    }

    populateProfileForm() {
        if (!this.currentUser) return;

        // Popola campi profilo
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profilePhone = document.getElementById('profilePhone');
        const profileBirth = document.getElementById('profileBirth');

        if (profileName) profileName.value = this.currentUser.name || '';
        if (profileEmail) profileEmail.value = this.currentUser.email || '';
        if (profilePhone) profilePhone.value = this.currentUser.phone || '';
        if (profileBirth) profileBirth.value = this.currentUser.birthDate || '';

        // Popola indirizzo
        const profileAddress = document.getElementById('profileAddress');
        const profileCity = document.getElementById('profileCity');
        const profileZip = document.getElementById('profileZip');
        const profileCountry = document.getElementById('profileCountry');

        if (profileAddress) profileAddress.value = this.currentUser.address || '';
        if (profileCity) profileCity.value = this.currentUser.city || '';
        if (profileZip) profileZip.value = this.currentUser.zip || '';
        if (profileCountry) profileCountry.value = this.currentUser.country || 'IT';

        // Popola preferenze
        const prefNewsletter = document.getElementById('prefNewsletter');
        const prefNotifications = document.getElementById('prefNotifications');
        const prefMarketing = document.getElementById('prefMarketing');
        const prefAnalytics = document.getElementById('prefAnalytics');

        if (prefNewsletter) prefNewsletter.checked = this.currentUser.preferences?.newsletter || false;
        if (prefNotifications) prefNotifications.checked = this.currentUser.preferences?.notifications || false;
        if (prefMarketing) prefMarketing.checked = this.currentUser.preferences?.marketing || false;
        if (prefAnalytics) prefAnalytics.checked = this.currentUser.preferences?.analytics || false;
    }

    populateSettingsForm() {
        if (!this.currentUser) return;

        // Popola impostazioni
        const themeSelect = document.getElementById('themeSelect');
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        const languageSelect = document.getElementById('languageSelect');
        const timezoneSelect = document.getElementById('timezoneSelect');

        if (themeSelect) themeSelect.value = this.currentUser.settings?.theme || 'auto';
        if (fontSizeSelect) fontSizeSelect.value = this.currentUser.settings?.fontSize || 'medium';
        if (languageSelect) languageSelect.value = this.currentUser.settings?.language || 'it';
        if (timezoneSelect) timezoneSelect.value = this.currentUser.settings?.timezone || 'Europe/Rome';

        // Popola notifiche
        const emailNotifications = document.getElementById('emailNotifications');
        const pushNotifications = document.getElementById('pushNotifications');
        const smsNotifications = document.getElementById('smsNotifications');

        if (emailNotifications) emailNotifications.checked = this.currentUser.settings?.emailNotifications !== false;
        if (pushNotifications) pushNotifications.checked = this.currentUser.settings?.pushNotifications !== false;
        if (smsNotifications) smsNotifications.checked = this.currentUser.settings?.smsNotifications || false;

        // Popola privacy
        const dataCollection = document.getElementById('dataCollection');
        const analytics = document.getElementById('analytics');
        const personalization = document.getElementById('personalization');

        if (dataCollection) dataCollection.checked = this.currentUser.settings?.dataCollection !== false;
        if (analytics) analytics.checked = this.currentUser.settings?.analytics !== false;
        if (personalization) personalization.checked = this.currentUser.settings?.personalization !== false;
    }

    saveProfile() {
        if (!this.currentUser) return;

        // Raccogli dati dal form
        const profileData = {
            name: document.getElementById('profileName')?.value || '',
            email: document.getElementById('profileEmail')?.value || '',
            phone: document.getElementById('profilePhone')?.value || '',
            birthDate: document.getElementById('profileBirth')?.value || ''
        };

        // Aggiorna utente
        this.currentUser = { ...this.currentUser, ...profileData };

        // Salva in localStorage
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        this.showNotification('✅ Profilo salvato con successo!', 'success');
        this.updateProfileUI();
    }

    saveAddress() {
        if (!this.currentUser) return;

        const addressData = {
            address: document.getElementById('profileAddress')?.value || '',
            city: document.getElementById('profileCity')?.value || '',
            zip: document.getElementById('profileZip')?.value || '',
            country: document.getElementById('profileCountry')?.value || 'IT'
        };

        this.currentUser = { ...this.currentUser, ...addressData };
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        this.showNotification('📍 Indirizzo salvato con successo!', 'success');
    }

    savePreferences() {
        if (!this.currentUser) return;

        const preferences = {
            newsletter: document.getElementById('prefNewsletter')?.checked || false,
            notifications: document.getElementById('prefNotifications')?.checked || false,
            marketing: document.getElementById('prefMarketing')?.checked || false,
            analytics: document.getElementById('prefAnalytics')?.checked || false
        };

        this.currentUser.preferences = preferences;
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        this.showNotification('⚙️ Preferenze salvate con successo!', 'success');
    }

    saveSettings() {
        if (!this.currentUser) return;

        const settings = {
            theme: document.getElementById('themeSelect')?.value || 'auto',
            fontSize: document.getElementById('fontSizeSelect')?.value || 'medium',
            language: document.getElementById('languageSelect')?.value || 'it',
            timezone: document.getElementById('timezoneSelect')?.value || 'Europe/Rome',
            emailNotifications: document.getElementById('emailNotifications')?.checked || false,
            pushNotifications: document.getElementById('pushNotifications')?.checked || false,
            smsNotifications: document.getElementById('smsNotifications')?.checked || false,
            dataCollection: document.getElementById('dataCollection')?.checked || false,
            analytics: document.getElementById('analytics')?.checked || false,
            personalization: document.getElementById('personalization')?.checked || false
        };

        this.currentUser.settings = settings;
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        // Applica impostazioni
        this.applySettings(settings);

        this.showNotification('⚙️ Impostazioni salvate e applicate!', 'success');
    }

    applySettings(settings) {
        // Applica tema
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else if (settings.theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        } else {
            // Tema automatico
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
            }
        }

        // Applica dimensione font
        document.body.style.fontSize = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        }[settings.fontSize] || '16px';

        // Applica lingua
        document.documentElement.lang = settings.language;
    }

    handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('❌ Compila tutti i campi', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('❌ Le password non coincidono', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('❌ La password deve essere di almeno 8 caratteri', 'error');
            return;
        }

        // Simula cambio password
        this.currentUser.passwordChanged = new Date().toISOString();
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        this.showNotification('✅ Password cambiata con successo!', 'success');
        this.closeAllModals();

        // Pulisci form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let text = '';

        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;

        if (strength <= 25) {
            strengthFill.className = 'strength-fill weak';
            text = 'Debole';
        } else if (strength <= 50) {
            strengthFill.className = 'strength-fill medium';
            text = 'Media';
        } else if (strength <= 75) {
            strengthFill.className = 'strength-fill strong';
            text = 'Forte';
        } else {
            strengthFill.className = 'strength-fill very-strong';
            text = 'Molto forte';
        }

        strengthFill.style.width = strength + '%';
        strengthText.textContent = text;
    }

    toggle2FA() {
        if (!this.currentUser) return;

        const isEnabled = this.currentUser.twoFactorEnabled || false;
        this.currentUser.twoFactorEnabled = !isEnabled;

        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));

        const btn = document.getElementById('toggle2FABtn');
        if (btn) {
            btn.textContent = this.currentUser.twoFactorEnabled ? '📱 Disattiva 2FA' : '📱 Attiva 2FA';
        }

        this.showNotification(
            this.currentUser.twoFactorEnabled ? '✅ Autenticazione 2FA attivata!' : '❌ Autenticazione 2FA disattivata!',
            this.currentUser.twoFactorEnabled ? 'success' : 'info'
        );
    }

    logoutAllDevices() {
        if (confirm('Sei sicuro di voler fare logout da tutti i dispositivi?')) {
            // Rimuovi tutti i dati utente
            localStorage.removeItem('demoUserData');
            this.currentUser = null;

            // Chiudi modali
            this.closeAllModals();

            // Aggiorna UI
            this.updateProfileUI();

            this.showNotification('🚪 Logout da tutti i dispositivi effettuato', 'info');
        }
    }

    updateProfileUI() {
        // Aggiorna UI del profilo se necessario
        const event = new CustomEvent('profileUpdated', { detail: this.currentUser });
        document.dispatchEvent(event);
    }

    showNotification(message, type = 'info') {
        // Crea notifica
        const notification = document.createElement('div');
        notification.className = `profile-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10002;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Metodi pubblici per uso esterno
    getUser() {
        return this.currentUser;
    }

    updateUser(userData) {
        this.currentUser = { ...this.currentUser, ...userData };
        localStorage.setItem('demoUserData', JSON.stringify(this.currentUser));
        this.updateProfileUI();
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.ProfileManager = new ProfileManager();
});

// Esporta per uso esterno
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManager;
}

/**
 * Dynamic Modals Manager
 * Crea tutti i modali dinamicamente per evitare problemi con l'editor
 */

class DynamicModalManager {
    constructor() {
        this.modals = {};
        this.init();
    }

    init() {
        this.createProfileModal();
        this.createPasswordModal();
        this.createSettingsModal();
        this.setupEventListeners();
    }

    createProfileModal() {
        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="profile-modal-content">
                    <div class="profile-modal-header">
                        <h2>👤 Profilo Utente</h2>
                        <button class="profile-modal-close" id="profileModalClose">✕</button>
                    </div>
                    
                    <div class="profile-modal-body">
                        <!-- Informazioni Personali -->
                        <div class="profile-section">
                            <h3>📋 Informazioni Personali</h3>
                            <div class="profile-form">
                                <div class="form-group">
                                    <label for="profileName">Nome Completo</label>
                                    <input type="text" id="profileName" placeholder="Il tuo nome completo">
                                </div>
                                <div class="form-group">
                                    <label for="profileEmail">Email</label>
                                    <input type="email" id="profileEmail" placeholder="La tua email">
                                </div>
                                <div class="form-group">
                                    <label for="profilePhone">Telefono</label>
                                    <input type="tel" id="profilePhone" placeholder="Il tuo numero di telefono">
                                </div>
                                <div class="form-group">
                                    <label for="profileBirth">Data di Nascita</label>
                                    <input type="date" id="profileBirth">
                                </div>
                                <button class="btn-profile-save" id="saveProfileBtn">💾 Salva Modifiche</button>
                            </div>
                        </div>

                        <!-- Indirizzo -->
                        <div class="profile-section">
                            <h3>📍 Indirizzo</h3>
                            <div class="profile-form">
                                <div class="form-group">
                                    <label for="profileAddress">Indirizzo</label>
                                    <input type="text" id="profileAddress" placeholder="Via e numero civico">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="profileCity">Città</label>
                                        <input type="text" id="profileCity" placeholder="Città">
                                    </div>
                                    <div class="form-group">
                                        <label for="profileZip">CAP</label>
                                        <input type="text" id="profileZip" placeholder="CAP">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="profileCountry">Paese</label>
                                    <select id="profileCountry">
                                        <option value="IT">Italia</option>
                                        <option value="DE">Germania</option>
                                        <option value="FR">Francia</option>
                                        <option value="ES">Spagna</option>
                                        <option value="CH">Svizzera</option>
                                    </select>
                                </div>
                                <button class="btn-profile-save" id="saveAddressBtn">💾 Salva Indirizzo</button>
                            </div>
                        </div>

                        <!-- Preferenze -->
                        <div class="profile-section">
                            <h3>⚙️ Preferenze</h3>
                            <div class="profile-preferences">
                                <div class="preference-item">
                                    <label class="preference-label">
                                        <input type="checkbox" id="prefNewsletter">
                                        <span class="checkmark"></span>
                                        📧 Newsletter settimanale
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label class="preference-label">
                                        <input type="checkbox" id="prefNotifications">
                                        <span class="checkmark"></span>
                                        🔔 Notifiche push
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label class="preference-label">
                                        <input type="checkbox" id="prefMarketing">
                                        <span class="checkmark"></span>
                                        📢 Offerte speciali
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label class="preference-label">
                                        <input type="checkbox" id="prefAnalytics">
                                        <span class="checkmark"></span>
                                        📊 Analisi utilizzo
                                    </label>
                                </div>
                                <button class="btn-profile-save" id="savePreferencesBtn">💾 Salva Preferenze</button>
                            </div>
                        </div>

                        <!-- Sicurezza -->
                        <div class="profile-section">
                            <h3>🔒 Sicurezza</h3>
                            <div class="profile-security">
                                <div class="security-item">
                                    <span class="security-label">Password</span>
                                    <button class="btn-change-password" id="changePasswordBtn">🔑 Cambia Password</button>
                                </div>
                                <div class="security-item">
                                    <span class="security-label">Autenticazione a due fattori</span>
                                    <button class="btn-toggle-2fa" id="toggle2FABtn">📱 Attiva 2FA</button>
                                </div>
                                <div class="security-item">
                                    <span class="security-label">Sessione attiva</span>
                                    <button class="btn-logout-all" id="logoutAllBtn">🚪 Logout da tutti i dispositivi</button>
                                </div>
                            </div>
                        </div>

                        <!-- Attività Recenti -->
                        <div class="profile-section">
                            <h3>📱 Attività Recenti</h3>
                            <div class="profile-activity" id="profileActivity">
                                <div class="activity-item">
                                    <div class="activity-icon">🔐</div>
                                    <div class="activity-details">
                                        <span class="activity-text">Login effettuato</span>
                                        <span class="activity-time">Oggi, 14:30</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">👁️</div>
                                    <div class="activity-details">
                                        <span class="activity-text">Visualizzato profilo</span>
                                        <span class="activity-time">Ieri, 16:45</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">❤️</div>
                                    <div class="activity-details">
                                        <span class="activity-text">Aggiunta auto ai preferiti</span>
                                        <span class="activity-time">2 giorni fa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modals.profile = this.createModalFromHTML(modalHTML);
    }

    createPasswordModal() {
        const modalHTML = `
            <div class="password-modal" id="passwordModal">
                <div class="password-modal-content">
                    <div class="password-modal-header">
                        <h3>🔑 Cambia Password</h3>
                        <button class="password-modal-close" id="passwordModalClose">✕</button>
                    </div>
                    <div class="password-modal-body">
                        <div class="form-group">
                            <label for="currentPassword">Password Attuale</label>
                            <input type="password" id="currentPassword" placeholder="Inserisci la password attuale">
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Nuova Password</label>
                            <input type="password" id="newPassword" placeholder="Inserisci la nuova password">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Conferma Password</label>
                            <input type="password" id="confirmPassword" placeholder="Conferma la nuova password">
                        </div>
                        <div class="password-strength" id="passwordStrength">
                            <div class="strength-bar">
                                <div class="strength-fill" id="strengthFill"></div>
                            </div>
                            <span class="strength-text" id="strengthText">Inserisci una password</span>
                        </div>
                        <button class="btn-change-password-confirm" id="confirmPasswordChangeBtn">🔑 Cambia Password</button>
                    </div>
                </div>
            </div>
        `;

        this.modals.password = this.createModalFromHTML(modalHTML);
    }

    createSettingsModal() {
        const modalHTML = `
            <div class="settings-modal" id="settingsModal">
                <div class="settings-modal-content">
                    <div class="settings-modal-header">
                        <h3>⚙️ Impostazioni Avanzate</h3>
                        <button class="settings-modal-close" id="settingsModalClose">✕</button>
                    </div>
                    <div class="settings-modal-body">
                        <div class="settings-section">
                            <h4>🎨 Aspetto</h4>
                            <div class="setting-item">
                                <label for="themeSelect">Tema</label>
                                <select id="themeSelect">
                                    <option value="auto">Automatico</option>
                                    <option value="light">Chiaro</option>
                                    <option value="dark">Scuro</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="fontSizeSelect">Dimensione Font</label>
                                <select id="fontSizeSelect">
                                    <option value="small">Piccolo</option>
                                    <option value="medium" selected>Medio</option>
                                    <option value="large">Grande</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4>🔔 Notifiche</h4>
                            <div class="setting-item">
                                <label for="emailNotifications">Email</label>
                                <input type="checkbox" id="emailNotifications" checked>
                            </div>
                            <div class="setting-item">
                                <label for="pushNotifications">Push</label>
                                <input type="checkbox" id="pushNotifications" checked>
                            </div>
                            <div class="setting-item">
                                <label for="smsNotifications">SMS</label>
                                <input type="checkbox" id="smsNotifications">
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4>🌐 Lingua e Regione</h4>
                            <div class="setting-item">
                                <label for="languageSelect">Lingua</label>
                                <select id="languageSelect">
                                    <option value="it" selected>Italiano</option>
                                    <option value="en">English</option>
                                    <option value="de">Deutsch</option>
                                    <option value="fr">Français</option>
                                    <option value="es">Español</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="timezoneSelect">Fuso Orario</label>
                                <select id="timezoneSelect">
                                    <option value="Europe/Rome" selected>Roma (UTC+1)</option>
                                    <option value="Europe/London">Londra (UTC+0)</option>
                                    <option value="Europe/Berlin">Berlino (UTC+1)</option>
                                    <option value="Europe/Paris">Parigi (UTC+1)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4>📊 Privacy</h4>
                            <div class="setting-item">
                                <label for="dataCollection">Raccolta Dati</label>
                                <input type="checkbox" id="dataCollection" checked>
                            </div>
                            <div class="setting-item">
                                <label for="analytics">Analytics</label>
                                <input type="checkbox" id="analytics" checked>
                            </div>
                            <div class="setting-item">
                                <label for="personalization">Personalizzazione</label>
                                <input type="checkbox" id="personalization" checked>
                            </div>
                        </div>
                        
                        <button class="btn-save-settings" id="saveSettingsBtn">💾 Salva Impostazioni</button>
                    </div>
                </div>
            </div>
        `;

        this.modals.settings = this.createModalFromHTML(modalHTML);
    }

    createModalFromHTML(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const modal = tempDiv.firstElementChild;
        
        // Nascondi il modale inizialmente
        modal.style.display = 'none';
        
        // Aggiungi al body
        document.body.appendChild(modal);
        
        return modal;
    }

    setupEventListeners() {
        // Event listener per il pulsante "Accedi / Registrati"
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // Event listener per il pulsante "Profilo" nel menu utente
        const profileMenuItem = document.getElementById('profileMenuItem');
        if (profileMenuItem) {
            profileMenuItem.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // Event listener per il pulsante "Impostazioni" nel menu utente
        const settingsMenuItem = document.getElementById('settingsMenuItem');
        if (settingsMenuItem) {
            settingsMenuItem.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }

        // Event listener per il pulsante "Cambia Password"
        document.addEventListener('click', (e) => {
            if (e.target.id === 'changePasswordBtn') {
                this.showPasswordModal();
            }
        });

        // Event listener per chiudere i modali
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('profile-modal-close') || 
                e.target.classList.contains('password-modal-close') || 
                e.target.classList.contains('settings-modal-close')) {
                this.hideAllModals();
            }
        });

        // Event listener per chiudere cliccando sull'overlay
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.hideAllModals();
            });
        }

        // Event listener per il tasto ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    showProfileModal() {
        this.hideAllModals();
        this.modals.profile.style.display = 'block';
        this.showOverlay();
        this.loadUserProfile();
    }

    showPasswordModal() {
        this.hideAllModals();
        this.modals.password.style.display = 'block';
        this.showOverlay();
    }

    showSettingsModal() {
        this.hideAllModals();
        this.modals.settings.style.display = 'block';
        this.showOverlay();
        this.loadUserSettings();
    }

    hideAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
        this.hideOverlay();
    }

    showOverlay() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.style.display = 'block';
    }

    hideOverlay() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    loadUserProfile() {
        // Carica i dati del profilo utente dal localStorage
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
        
        if (userProfile.name) document.getElementById('profileName').value = userProfile.name;
        if (userProfile.email) document.getElementById('profileEmail').value = userProfile.email;
        if (userProfile.phone) document.getElementById('profilePhone').value = userProfile.phone;
        if (userProfile.birth) document.getElementById('profileBirth').value = userProfile.birth;
        if (userProfile.address) document.getElementById('profileAddress').value = userProfile.address;
        if (userProfile.city) document.getElementById('profileCity').value = userProfile.city;
        if (userProfile.zip) document.getElementById('profileZip').value = userProfile.zip;
        if (userProfile.country) document.getElementById('profileCountry').value = userProfile.country;
    }

    loadUserSettings() {
        // Carica le impostazioni utente dal localStorage
        const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        
        if (userSettings.theme) document.getElementById('themeSelect').value = userSettings.theme;
        if (userSettings.fontSize) document.getElementById('fontSizeSelect').value = userSettings.fontSize;
        if (userSettings.language) document.getElementById('languageSelect').value = userSettings.language;
        if (userSettings.timezone) document.getElementById('timezoneSelect').value = userSettings.timezone;
    }

    saveUserProfile() {
        const profileData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            birth: document.getElementById('profileBirth').value,
            address: document.getElementById('profileAddress').value,
            city: document.getElementById('profileCity').value,
            zip: document.getElementById('profileZip').value,
            country: document.getElementById('profileCountry').value
        };

        localStorage.setItem('userProfile', JSON.stringify(profileData));
        this.showNotification('Profilo salvato con successo!', 'success');
    }

    saveUserSettings() {
        const settingsData = {
            theme: document.getElementById('themeSelect').value,
            fontSize: document.getElementById('fontSizeSelect').value,
            language: document.getElementById('languageSelect').value,
            timezone: document.getElementById('timezoneSelect').value
        };

        localStorage.setItem('userSettings', JSON.stringify(settingsData));
        this.showNotification('Impostazioni salvate con successo!', 'success');
    }

    showNotification(message, type = 'info') {
        // Crea una notifica toast
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // Rimuovi la notifica dopo 3 secondi
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Inizializza il manager dei modali quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new DynamicModalManager();
});

// Esporta per uso esterno
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicModalManager;
}

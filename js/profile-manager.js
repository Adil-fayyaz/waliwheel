/**
 * Wali Wheels - Profile Management System
 * Gestisce profilo utente, modifiche dati e operazioni account
 */

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.originalData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.bindEvents();
        this.updateProfileDisplay();
    }

    loadUserData() {
        // Carica dati utente da localStorage o crea demo
        const savedUser = localStorage.getItem('waliwheels_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            // Crea utente demo
            this.currentUser = {
                id: 'user-' + Date.now(),
                firstName: 'Mario',
                lastName: 'Rossi',
                email: 'mario.rossi@example.com',
                phone: '+39 123 456 789',
                address: 'Via Roma 123, Milano',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            this.saveUserData();
        }
        this.originalData = { ...this.currentUser };
    }

    saveUserData() {
        localStorage.setItem('waliwheels_user', JSON.stringify(this.currentUser));
    }

    bindEvents() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Chiudi dropdown cliccando fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-menu')) {
                this.closeProfileDropdown();
            }
        });
    }

    updateProfileDisplay() {
        // Aggiorna header del profilo
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        if (profileEmail) profileEmail.textContent = this.currentUser.email;

        // Popola form
        this.populateForm();
    }

    populateForm() {
        const form = document.getElementById('profileForm');
        if (!form) return;

        const fields = ['firstName', 'lastName', 'email', 'phone', 'address'];
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input && this.currentUser[field]) {
                input.value = this.currentUser[field];
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedData = {};
        
        for (let [key, value] of formData.entries()) {
            updatedData[key] = value.trim();
        }

        // Validazione
        if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
            this.showToast('Compila tutti i campi obbligatori', 'error');
            return;
        }

        if (!this.isValidEmail(updatedData.email)) {
            this.showToast('Email non valida', 'error');
            return;
        }

        // Aggiorna dati utente
        this.currentUser = { ...this.currentUser, ...updatedData };
        this.currentUser.lastUpdated = new Date().toISOString();
        
        this.saveUserData();
        this.originalData = { ...this.currentUser };
        
        this.showToast('Profilo aggiornato con successo! ✅', 'success');
        this.updateProfileDisplay();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    resetForm() {
        if (confirm('Ripristinare i dati originali?')) {
            this.currentUser = { ...this.originalData };
            this.populateForm();
            this.showToast('Form ripristinato', 'info');
        }
    }

    changePassword() {
        const newPassword = prompt('Inserisci la nuova password:');
        if (newPassword && newPassword.length >= 6) {
            this.currentUser.password = newPassword; // In produzione, hashare la password
            this.saveUserData();
            this.showToast('Password aggiornata con successo! 🔒', 'success');
        } else if (newPassword !== null) {
            this.showToast('La password deve essere di almeno 6 caratteri', 'error');
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.currentUser, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `waliwheels_profile_${this.currentUser.id}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Dati esportati con successo! 📁', 'success');
    }

    deleteAccount() {
        document.getElementById('deleteModal').style.display = 'flex';
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        document.getElementById('confirmEmail').value = '';
    }

    confirmDeleteAccount() {
        const confirmEmail = document.getElementById('confirmEmail').value;
        
        if (confirmEmail !== this.currentUser.email) {
            this.showToast('Email non corrisponde', 'error');
            return;
        }

        if (confirm('ATTENZIONE: Questa azione eliminerà definitivamente il tuo account. Sei assolutamente sicuro?')) {
            // Elimina dati utente
            localStorage.removeItem('waliwheels_user');
            localStorage.removeItem('waliwheels_cars'); // Rimuovi anche auto associate
            localStorage.removeItem('ww_lang'); // Mantieni lingua
            
            this.showToast('Account eliminato. Reindirizzamento...', 'info');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    showToast(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Crea toast visivo
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#667eea'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Anima entrata
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // Rimuovi dopo 4 secondi
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Funzioni globali per i pulsanti HTML
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileBtn');
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        btn.classList.remove('active');
        } else {
        dropdown.classList.add('active');
        btn.classList.add('active');
    }
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileBtn');
    
    dropdown.classList.remove('active');
    btn.classList.remove('active');
}

function performLogout() {
    if (confirm('Effettuare il logout?')) {
        // Rimuovi dati sessione
        localStorage.removeItem('waliwheels_user');
        
        // Nascondi menu profilo
        document.getElementById('profileMenu').style.display = 'none';
        document.getElementById('authContainer').style.display = 'block';
        
        // Reindirizza alla home
        window.location.href = 'index.html';
    }
}

function resetForm() {
    if (window.profileManager) {
        window.profileManager.resetForm();
    }
}

function changePassword() {
    if (window.profileManager) {
        window.profileManager.changePassword();
    }
}

function exportData() {
    if (window.profileManager) {
        window.profileManager.exportData();
    }
}

function deleteAccount() {
    if (window.profileManager) {
        window.profileManager.deleteAccount();
    }
}

function closeDeleteModal() {
    if (window.profileManager) {
        window.profileManager.closeDeleteModal();
    }
}

function confirmDeleteAccount() {
    if (window.profileManager) {
        window.profileManager.confirmDeleteAccount();
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
    
    // Mostra menu profilo se utente loggato
    if (localStorage.getItem('waliwheels_user')) {
        document.getElementById('profileMenu').style.display = 'block';
        document.getElementById('authContainer').style.display = 'none';
    }
});













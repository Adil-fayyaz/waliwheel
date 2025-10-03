// ===== SETTINGS PAGE =====

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Check authentication and load user data
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserData(user);
    } else {
        // Redirect to home if not logged in
        window.location.href = 'index.html';
    }
});

function loadUserData(user) {
    // Header info
    document.getElementById('userName').textContent = user.displayName || 'Utente';
    document.getElementById('userEmail').textContent = user.email || 'Non disponibile';
    
    // Member since
    const creationDate = new Date(user.metadata.creationTime);
    document.getElementById('memberSince').textContent = creationDate.getFullYear();
    
    // Account Info
    document.getElementById('displayName').textContent = user.displayName || 'Non impostato';
    document.getElementById('displayEmail').textContent = user.email || 'Non disponibile';
    document.getElementById('authProvider').textContent = getProviderName(user.providerData[0]?.providerId);
    document.getElementById('emailVerified').textContent = user.emailVerified ? '✅ Verificata' : '❌ Non verificata';
    document.getElementById('userUID').textContent = user.uid;
    
    // Activity stats
    const lastLoginDate = new Date(user.metadata.lastSignInTime);
    const creationDateFull = new Date(user.metadata.creationTime);
    
    document.getElementById('lastLogin').textContent = formatDate(lastLoginDate);
    document.getElementById('creationTime').textContent = formatDate(creationDateFull);
    
    // Calculate login count (simulated from localStorage)
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.uid}`)) || 1;
    document.getElementById('loginCount').textContent = loginCount;
    
    // Update avatar if user has photo
    if (user.photoURL) {
        const avatar = document.getElementById('userAvatar');
        avatar.style.backgroundImage = `url(${user.photoURL})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.innerHTML = ''; // Remove SVG
    }
}

function getProviderName(providerId) {
    const providers = {
        'google.com': 'Google',
        'password': 'Email/Password',
        'facebook.com': 'Facebook',
        'twitter.com': 'Twitter',
        'github.com': 'GitHub'
    };
    return providers[providerId] || providerId || 'Sconosciuto';
}

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString('it-IT', options);
}

// Global functions for buttons
window.editProfile = function() {
    showToast('Funzionalità di modifica profilo in arrivo!', 'info');
};

window.changePassword = async function() {
    const user = auth.currentUser;
    if (!user) return;
    
    if (user.providerData[0]?.providerId === 'google.com') {
        showToast('Non puoi cambiare la password per account Google', 'error');
        return;
    }
    
    const email = prompt('Inserisci la tua email per ricevere il link di reset password:');
    if (email) {
        try {
            const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await sendPasswordResetEmail(auth, email);
            showToast('Email di reset password inviata!', 'success');
        } catch (error) {
            showToast('Errore: ' + error.message, 'error');
        }
    }
};

window.exportData = function() {
    const user = auth.currentUser;
    if (!user) return;
    
    const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        emailVerified: user.emailVerified,
        provider: user.providerData[0]?.providerId,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
        photoURL: user.photoURL,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wali-wheels-account-${user.uid}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Dati esportati con successo!', 'success');
};

window.logoutUser = async function() {
    if (confirm('Sei sicuro di voler uscire?')) {
        try {
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signOut(auth);
            showToast('Logout effettuato con successo!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            showToast('Errore durante il logout: ' + error.message, 'error');
        }
    }
};

window.deleteAccount = async function() {
    const user = auth.currentUser;
    if (!user) return;
    
    const confirmation = prompt('Sei sicuro di voler eliminare il tuo account? Questa azione è IRREVERSIBILE.\n\nDigita "ELIMINA" per confermare:');
    
    if (confirmation === 'ELIMINA') {
        try {
            await user.delete();
            showToast('Account eliminato con successo', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                showToast('Devi effettuare nuovamente il login per eliminare l\'account', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showToast('Errore: ' + error.message, 'error');
            }
        }
    }
};

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#00cc6a'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        word-wrap: break-word;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

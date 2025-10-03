// ===== PROFILE PAGE INTERACTIONS =====

class ProfileInteractions {
    constructor() {
        this.profileForm = document.getElementById('profileForm');
        this.deleteModal = document.getElementById('deleteModal');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupModalHandlers();
        this.setupAvatarUpload();
        this.setupKeyboardShortcuts();
        this.setupAnimations();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        // Remove existing error state
        this.clearFieldError(field);
        
        // Validation rules
        if (field.required && !value) {
            this.showFieldError(field, 'Questo campo è obbligatorio');
            return false;
        }

        switch(fieldName) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Inserisci un indirizzo email valido');
                    return false;
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Inserisci un numero di telefono valido');
                    return false;
                }
                break;
        }

        this.showFieldSuccess(field);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = 'rgba(255, 107, 107, 0.5)';
        field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.2)';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.style.borderColor = 'rgba(0, 255, 136, 0.5)';
        field.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupFormSubmission() {
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    async handleFormSubmission() {
        const formData = new FormData(this.profileForm);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.profileForm.querySelectorAll('.form-input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showToast('Correggi gli errori nel form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.profileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Salvataggio...</span>';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showToast('Profilo aggiornato con successo!', 'success');
            this.animateSuccess();
        } catch (error) {
            this.showToast('Errore durante il salvataggio', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    async simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 2000);
        });
    }

    setupModalHandlers() {
        // Delete account modal
        const deleteBtn = document.querySelector('[onclick="deleteAccount()"]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.showDeleteModal();
            });
        }

        // Modal close handlers
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDeleteModal();
            });
        }

        // Confirm delete
        const confirmBtn = document.querySelector('[onclick="confirmDeleteAccount()"]');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.handleDeleteAccount();
            });
        }

        // Close modal on overlay click
        if (this.deleteModal) {
            this.deleteModal.addEventListener('click', (e) => {
                if (e.target === this.deleteModal) {
                    this.hideDeleteModal();
                }
            });
        }
    }

    showDeleteModal() {
        if (this.deleteModal) {
            this.deleteModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideDeleteModal() {
        if (this.deleteModal) {
            this.deleteModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async handleDeleteAccount() {
        const emailInput = document.getElementById('confirmEmail');
        const userEmail = 'user@example.com'; // This would come from auth system
        
        if (emailInput.value !== userEmail) {
            this.showToast('Email non corretta', 'error');
            emailInput.classList.add('error');
            return;
        }
        
        const confirmBtn = document.querySelector('[onclick="confirmDeleteAccount()"]');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<span>Eliminazione...</span>';
        confirmBtn.disabled = true;
        
        try {
            await this.simulateAPICall();
            this.showToast('Account eliminato con successo', 'success');
            this.hideDeleteModal();
            
            // Redirect to home page after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            this.showToast('Errore durante l\'eliminazione', 'error');
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    setupAvatarUpload() {
        const avatar = document.querySelector('.profile-avatar-large');
        if (avatar) {
            avatar.addEventListener('click', () => {
                this.triggerAvatarUpload();
            });
            
            // Add hover effect
            avatar.addEventListener('mouseenter', () => {
                avatar.style.transform = 'scale(1.1)';
            });
            
            avatar.addEventListener('mouseleave', () => {
                avatar.style.transform = '';
            });
        }
    }

    triggerAvatarUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleAvatarUpload(file);
            }
        });
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    async handleAvatarUpload(file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('Seleziona un file immagine valido', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showToast('Il file è troppo grande (max 5MB)', 'error');
            return;
        }
        
        // Show loading
        const avatar = document.querySelector('.profile-avatar-large');
        avatar.classList.add('loading');
        
        try {
            // Simulate upload
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update avatar preview
            const reader = new FileReader();
            reader.onload = (e) => {
                avatar.style.backgroundImage = `url(${e.target.result})`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file);
            
            this.showToast('Avatar aggiornato con successo!', 'success');
        } catch (error) {
            this.showToast('Errore durante l\'upload', 'error');
        } finally {
            avatar.classList.remove('loading');
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (this.profileForm) {
                    this.profileForm.dispatchEvent(new Event('submit'));
                }
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.hideDeleteModal();
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    animateSuccess() {
        const avatar = document.querySelector('.profile-avatar-large');
        if (avatar) {
            avatar.style.animation = 'none';
            setTimeout(() => {
                avatar.style.animation = 'avatarFloat 6s ease-in-out infinite';
            }, 100);
        }
        
        // Add success particles
        this.createSuccessParticles();
    }

    createSuccessParticles() {
        const container = document.querySelector('.profile-header-card');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = Math.random() * container.offsetWidth;
            const startY = Math.random() * container.offsetHeight;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            container.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: 'scale(0) translateY(0px)', opacity: 1 },
                { transform: 'scale(1) translateY(-100px)', opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff6b6b'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
        }, 3000);
    }
}

// Global functions for backward compatibility
window.changePassword = function() {
    window.profileInteractions.showToast('Funzionalità in arrivo!', 'info');
};

window.exportData = function() {
    window.profileInteractions.showToast('Esportazione dati in corso...', 'info');
    
    // Simulate data export
    setTimeout(() => {
        const data = {
            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'profile-data.json';
        a.click();
        URL.revokeObjectURL(url);
        
        window.profileInteractions.showToast('Dati esportati con successo!', 'success');
    }, 2000);
};

window.deleteAccount = function() {
    window.profileInteractions.showDeleteModal();
};

window.confirmDeleteAccount = function() {
    window.profileInteractions.handleDeleteAccount();
};

window.closeDeleteModal = function() {
    window.profileInteractions.hideDeleteModal();
};

window.resetForm = function() {
    if (confirm('Sei sicuro di voler ripristinare i dati originali?')) {
        document.getElementById('profileForm').reset();
        window.profileInteractions.showToast('Form ripristinato', 'info');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileInteractions = new ProfileInteractions();
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 1rem; border-radius: 10px; font-size: 0.8rem; z-index: 1000;">
            <strong>Scorciatoie:</strong><br>
            Ctrl/Cmd + S - Salva<br>
            ESC - Chiudi modale<br>
            Clicca avatar - Cambia foto
        </div>
    `;
    document.body.appendChild(shortcutsInfo);

    // Hide shortcuts info after 5 seconds
    setTimeout(() => {
        shortcutsInfo.style.opacity = '0';
        shortcutsInfo.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            shortcutsInfo.remove();
        }, 500);
    }, 5000);
});

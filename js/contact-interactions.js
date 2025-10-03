// ===== CONTACT PAGE INTERACTIONS =====

class ContactInteractions {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.contactCards = document.querySelectorAll('.contact-card');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupFAQInteractions();
        this.setupContactCardInteractions();
        this.setupMapInteractions();
        this.setupKeyboardShortcuts();
        this.setupAnimations();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
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
            case 'contactEmail':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Inserisci un indirizzo email valido');
                    return false;
                }
                break;
            case 'contactPhone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Inserisci un numero di telefono valido');
                    return false;
                }
                break;
            case 'contactMessage':
                if (value && value.length < 10) {
                    this.showFieldError(field, 'Il messaggio deve essere di almeno 10 caratteri');
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
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    async handleFormSubmission() {
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
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
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Invio in corso...</span>';
        submitBtn.disabled = true;
        this.contactForm.classList.add('form-loading');
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showToast('Messaggio inviato con successo! Ti risponderemo al più presto.', 'success');
            this.contactForm.reset();
            this.animateSuccess();
        } catch (error) {
            this.showToast('Errore durante l\'invio del messaggio', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.contactForm.classList.remove('form-loading');
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

    setupFAQInteractions() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            question.addEventListener('click', () => {
                this.toggleFAQ(item, answer, toggle);
            });
        });
    }

    toggleFAQ(item, answer, toggle) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherToggle = otherItem.querySelector('.faq-toggle');
                otherAnswer.style.maxHeight = null;
                otherToggle.textContent = '+';
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
            toggle.textContent = '+';
        } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            toggle.textContent = '−';
        }
    }

    setupContactCardInteractions() {
        this.contactCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleContactCardClick(card);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateContactCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateContactCard(card, 'leave');
            });
        });
    }

    handleContactCardClick(card) {
        const cardType = card.querySelector('h3').textContent.toLowerCase();
        
        switch(cardType) {
            case 'telefono':
                this.showToast('Chiamata simulata al +39 02 1234567', 'info');
                break;
            case 'email':
                window.location.href = 'mailto:info@walwheels.it';
                break;
            case 'indirizzo':
                this.showToast('Indirizzo copiato negli appunti', 'success');
                navigator.clipboard.writeText('Via Roma 123, 20100 Milano, Italia');
                break;
            case 'orari':
                this.showToast('Orari: Lun-Ven 9:00-18:00, Sab 9:00-12:00', 'info');
                break;
        }
    }

    animateContactCard(card, action) {
        const icon = card.querySelector('.contact-icon');
        
        if (action === 'enter') {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.filter = 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.6))';
        } else {
            icon.style.transform = '';
            icon.style.filter = '';
        }
    }

    setupMapInteractions() {
        const mapContainer = document.querySelector('.google-map-container');
        const directionsBtn = document.querySelector('.btn-directions');
        const callBtn = document.querySelector('.btn-call');
        
        if (mapContainer) {
            mapContainer.addEventListener('click', () => {
                this.showToast('Mappa interattiva in arrivo!', 'info');
            });
        }
        
        if (directionsBtn) {
            directionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openDirections();
            });
        }
        
        if (callBtn) {
            callBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.makeCall();
            });
        }
    }

    openDirections() {
        const address = 'Via Roma 123, 20100 Milano, Italia';
        const encodedAddress = encodeURIComponent(address);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        
        window.open(mapsUrl, '_blank');
        this.showToast('Apertura indicazioni stradali...', 'info');
    }

    makeCall() {
        const phoneNumber = '+39021234567';
        window.location.href = `tel:${phoneNumber}`;
        this.showToast('Chiamata in corso...', 'info');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.contactForm) {
                    this.contactForm.dispatchEvent(new Event('submit'));
                }
            }
            
            // Escape to close FAQ
            if (e.key === 'Escape') {
                this.closeAllFAQ();
            }
        });
    }

    closeAllFAQ() {
        this.faqItems.forEach(item => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            answer.style.maxHeight = null;
            toggle.textContent = '+';
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
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            formContainer.classList.add('success-animation');
            setTimeout(() => {
                formContainer.classList.remove('success-animation');
            }, 600);
        }
        
        // Add success particles
        this.createSuccessParticles();
    }

    createSuccessParticles() {
        const container = document.querySelector('.contact-form-container');
        if (!container) return;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
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
                { transform: 'scale(1) translateY(-150px)', opacity: 0 }
            ], {
                duration: 2500,
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactInteractions = new ContactInteractions();
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 1rem; border-radius: 10px; font-size: 0.8rem; z-index: 1000;">
            <strong>Scorciatoie:</strong><br>
            Ctrl/Cmd + Enter - Invia form<br>
            ESC - Chiudi FAQ<br>
            Clicca carte contatto - Azioni
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

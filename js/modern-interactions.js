/* ===== MODERN INTERACTIONS & ANIMATIONS ===== */

// Intersection Observer per animazioni di entrata
class ModernAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupMagneticEffects();
        this.setupShimmerEffects();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animazione counter per statistiche
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Osserva tutti gli elementi con classi di animazione
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stat-number').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.parallax-layer');
            
            parallax.forEach(layer => {
                const speed = layer.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });

            // Header glass effect
            const header = document.querySelector('.header-glass');
            if (header) {
                if (scrolled > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    setupParallaxEffects() {
        document.querySelectorAll('.parallax-layer').forEach(layer => {
            layer.style.willChange = 'transform';
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count) || 0;
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = currentValue.toLocaleString('it-IT');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    setupMagneticEffects() {
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 50;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const moveX = x * force * 0.3;
                    const moveY = y * force * 0.3;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    setupShimmerEffects() {
        document.querySelectorAll('.shimmer').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'shimmer 0.6s ease-out';
            });

            element.addEventListener('animationend', () => {
                element.style.animation = '';
            });
        });
    }
}

// Gestione form moderna
class ModernForms {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormAnimations();
        this.setupInputEffects();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });

            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        let isValid = true;
        let message = '';

        if (required && !value) {
            isValid = false;
            message = 'Questo campo è obbligatorio';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Inserisci un indirizzo email valido';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Inserisci un numero di telefono valido';
        }

        this.showFieldError(field, isValid, message);
        return isValid;
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (!isValid) {
            field.classList.add('error');
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = message;
                field.parentNode.appendChild(error);
            } else {
                errorElement.textContent = message;
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupFormAnimations() {
        const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check if field has value on load
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });
    }

    setupInputEffects() {
        const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(0, 255, 136, 0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = '';
                input.style.boxShadow = '';
            });
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
}

// Gestione modali moderne
class ModernModals {
    constructor() {
        this.init();
    }

    init() {
        this.setupModalTriggers();
        this.setupModalClose();
        this.setupModalAnimations();
    }

    setupModalTriggers() {
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });
    }

    setupModalClose() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }

    closeModal() {
        const openModal = document.querySelector('.modal-overlay.show');
        if (openModal) {
            openModal.classList.remove('show');
            setTimeout(() => {
                openModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    setupModalAnimations() {
        const modals = document.querySelectorAll('.modal-overlay');
        
        modals.forEach(modal => {
            modal.style.transition = 'opacity 0.3s ease';
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transition = 'transform 0.3s ease';
            }
        });
    }
}

// Gestione notifiche toast
class ModernNotifications {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        this.container.appendChild(toast);

        // Animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => this.remove(toast), duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Gestione tema scuro/chiaro
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupToggle();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animation
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    new ModernAnimations();
    new ModernForms();
    new ModernModals();
    new ThemeManager();
    
    // Notifiche globali
    window.notifications = new ModernNotifications();
    
    // Funzioni globali per compatibilità
    window.showToast = (message, type) => {
        return window.notifications.show(message, type);
    };
});

// CSS per le animazioni (iniettato dinamicamente)
const animationStyles = `
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
}

.toast-notification {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    min-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    pointer-events: auto;
}

.toast-notification.show {
    opacity: 1;
    transform: translateX(0);
}

.toast-notification.success {
    border-left: 4px solid #00ff88;
}

.toast-notification.error {
    border-left: 4px solid #ff6b6b;
}

.toast-notification.warning {
    border-left: 4px solid #ffa726;
}

.toast-notification.info {
    border-left: 4px solid #42a5f5;
}

.toast-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
}

.field-error {
    color: #ff6b6b;
    font-size: 0.8rem;
    margin-top: 4px;
}

.form-input.error,
.form-select.error,
.form-textarea.error {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
}

.modal-overlay.show {
    opacity: 1;
}

.modal-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 2rem;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal-overlay.show .modal-content {
    transform: scale(1);
}

[data-theme="light"] {
    --dark-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    --glass-bg: rgba(255, 255, 255, 0.8);
    --glass-border: rgba(0, 0, 0, 0.1);
    --light-color: #1e293b;
    --dark-color: #ffffff;
}

[data-theme="light"] .toast-notification {
    background: rgba(0, 0, 0, 0.1);
    color: #1e293b;
    border: 1px solid rgba(0, 0, 0, 0.2);
}

[data-theme="light"] .toast-close {
    color: #1e293b;
}
`;

// Inietta gli stili
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

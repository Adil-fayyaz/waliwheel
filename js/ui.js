// AutoShop Premium - Interfaccia Utente e Componenti

class UI {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupToastSystem();
        this.setupModals();
        this.setupTooltips();
        this.setupLoadingStates();
        this.setupFormValidation();
        this.setupScrollEffects();
        this.setupMobileOptimizations();
    }
    
    // ===== SISTEMA TOAST =====
    setupToastSystem() {
        this.toastContainer = document.getElementById('toastContainer');
        if (!this.toastContainer) {
            this.createToastContainer();
        }
        
        this.toastQueue = [];
        this.isShowingToast = false;
    }
    
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toastContainer';
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }
    
    showToast(message, type = 'info', duration = 5000) {
        const toast = this.createToastElement(message, type);
        this.toastQueue.push({ toast, duration });
        
        if (!this.isShowingToast) {
            this.processToastQueue();
        }
    }
    
    createToastElement(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <span class="toast-message">${message}</span>
                <button class="toast-close" aria-label="Chiudi notifica">&times;</button>
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Event listener per chiudere
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        return toast;
    }
    
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    processToastQueue() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }
        
        this.isShowingToast = true;
        const { toast, duration } = this.toastQueue.shift();
        
        this.toastContainer.appendChild(toast);
        
        // Animazione di entrata
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Progress bar
        const progress = toast.querySelector('.toast-progress');
        if (progress) {
            gsap.to(progress, {
                width: '0%',
                duration: duration / 1000,
                ease: 'none'
            });
        }
        
        // Auto-remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }
    
    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.processToastQueue();
        }, 300);
    }
    
    // ===== SISTEMA MODALI =====
    setupModals() {
        this.modals = new Map();
        this.activeModal = null;
        
        // Event listener per chiusura modali
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal(e.target.dataset.modalId);
            }
        });
        
        // Event listener per tasto ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
    }
    
    createModal(id, content, options = {}) {
        const defaultOptions = {
            closable: true,
            size: 'medium',
            animation: 'fade',
            ...options
        };
        
        const modal = document.createElement('div');
        modal.className = `modal ${defaultOptions.animation}`;
        modal.id = `modal-${id}`;
        
        modal.innerHTML = `
            <div class="modal-backdrop" data-modal-id="${id}"></div>
            <div class="modal-container modal-${defaultOptions.size}">
                <div class="modal-header">
                    <h3 class="modal-title">${options.title || ''}</h3>
                    ${defaultOptions.closable ? '<button class="modal-close" aria-label="Chiudi modale">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        
        // Event listener per chiusura
        if (defaultOptions.closable) {
            modal.querySelector('.modal-close').addEventListener('click', () => {
                this.closeModal(id);
            });
        }
        
        this.modals.set(id, { element: modal, options: defaultOptions });
        return modal;
    }
    
    showModal(id, content, options = {}) {
        let modalData = this.modals.get(id);
        
        if (!modalData) {
            const modal = this.createModal(id, content, options);
            modalData = { element: modal, options: options };
            this.modals.set(id, modalData);
        }
        
        // Nascondi modale attivo se presente
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
        
        document.body.appendChild(modalData.element);
        this.activeModal = id;
        
        // Animazione di entrata
        requestAnimationFrame(() => {
            modalData.element.classList.add('show');
        });
        
        // Blocca scroll del body
        document.body.style.overflow = 'hidden';
        
        return modalData.element;
    }
    
    closeModal(id) {
        const modalData = this.modals.get(id);
        if (!modalData) return;
        
        modalData.element.classList.remove('show');
        
        setTimeout(() => {
            if (modalData.element.parentNode) {
                modalData.element.parentNode.removeChild(modalData.element);
            }
            
            if (this.activeModal === id) {
                this.activeModal = null;
                document.body.style.overflow = '';
            }
        }, 300);
    }
    
    // ===== SISTEMA TOOLTIP =====
    setupTooltips() {
        this.tooltips = new Map();
        
        // Event listeners per tooltip
        document.addEventListener('mouseover', (e) => {
            const tooltipTrigger = e.target.closest('[data-tooltip]');
            if (tooltipTrigger) {
                this.showTooltip(tooltipTrigger);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const tooltipTrigger = e.target.closest('[data-tooltip]');
            if (tooltipTrigger) {
                this.hideTooltip(tooltipTrigger);
            }
        });
    }
    
    showTooltip(element) {
        const text = element.dataset.tooltip;
        const position = element.dataset.tooltipPosition || 'top';
        
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        // Posizionamento
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left, top;
        
        switch (position) {
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + 8;
                break;
            case 'left':
                left = rect.left - tooltipRect.width - 8;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                left = rect.right + 8;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        // Animazione
        tooltip.style.opacity = '0';
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        this.tooltips.set(element, tooltip);
    }
    
    hideTooltip(element) {
        const tooltip = this.tooltips.get(element);
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                this.tooltips.delete(element);
            }, 200);
        }
    }
    
    // ===== STATI DI CARICAMENTO =====
    setupLoadingStates() {
        // Loading spinner per bottoni
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-loading]');
            if (button) {
                this.setButtonLoading(button, true);
            }
        });
    }
    
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = `
                <span class="loading-spinner"></span>
                <span>Caricamento...</span>
            `;
        } else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }
        }
    }
    
    // ===== VALIDAZIONE FORM =====
    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('validate-form')) {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            }
        });
        
        // Validazione in tempo reale
        document.addEventListener('input', (e) => {
            const input = e.target;
            if (input.classList.contains('validate-input')) {
                this.validateInput(input);
            }
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');
        const pattern = input.pattern;
        const minLength = input.minLength;
        const maxLength = input.maxLength;
        
        let isValid = true;
        let errorMessage = '';
        
        // Validazione required
        if (required && !value) {
            isValid = false;
            errorMessage = 'Questo campo è obbligatorio';
        }
        
        // Validazione email
        if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Inserisci un indirizzo email valido';
        }
        
        // Validazione pattern
        if (pattern && value && !new RegExp(pattern).test(value)) {
            isValid = false;
            errorMessage = input.dataset.patternError || 'Formato non valido';
        }
        
        // Validazione lunghezza
        if (minLength && value.length < minLength) {
            isValid = false;
            errorMessage = `Minimo ${minLength} caratteri`;
        }
        
        if (maxLength && value.length > maxLength) {
            isValid = false;
            errorMessage = `Massimo ${maxLength} caratteri`;
        }
        
        // Applica stato di validazione
        this.setInputValidationState(input, isValid, errorMessage);
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    setInputValidationState(input, isValid, errorMessage) {
        input.classList.remove('valid', 'invalid');
        input.classList.add(isValid ? 'valid' : 'invalid');
        
        // Rimuovi messaggio di errore esistente
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Aggiungi nuovo messaggio di errore se necessario
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            errorElement.textContent = errorMessage;
            input.parentNode.appendChild(errorElement);
        }
    }
    
    // ===== EFFETTI SCROLL =====
    setupScrollEffects() {
        // Smooth scroll per link interni
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Scroll to top button
        this.setupScrollToTop();
    }
    
    setupScrollToTop() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.setAttribute('aria-label', 'Torna in cima');
        
        document.body.appendChild(scrollToTopBtn);
        
        // Mostra/nascondi button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Click event
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== OTTIMIZZAZIONI MOBILE =====
    setupMobileOptimizations() {
        // Touch feedback per bottoni
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', (e) => {
                const button = e.target.closest('button, .clickable');
                if (button) {
                    button.classList.add('touch-active');
                }
            });
            
            document.addEventListener('touchend', (e) => {
                const button = e.target.closest('button, .clickable');
                if (button) {
                    button.classList.remove('touch-active');
                }
            });
        }
        
        // Gestione orientamento dispositivo
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (window.gsapAnimations) {
                    window.gsapAnimations.refreshAnimations();
                }
            }, 500);
        });
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Format number
    formatNumber(num, locale = 'it-IT') {
        return new Intl.NumberFormat(locale).format(num);
    }
    
    // Format currency
    formatCurrency(amount, currency = 'EUR', locale = 'it-IT') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    // Format date
    formatDate(date, locale = 'it-IT') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }
    
    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copiato negli appunti!', 'success');
            return true;
        } catch (err) {
            // Fallback per browser più vecchi
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Copiato negli appunti!', 'success');
            return true;
        }
    }
    
    // Share API
    async shareContent(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (err) {
                console.log('Condivisione annullata');
                return false;
            }
        } else {
            // Fallback per browser che non supportano Web Share API
            this.showToast('Condivisione non supportata dal browser', 'warning');
            return false;
        }
    }
}

// Inizializza UI quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.ui = new UI();
    console.log('🎨 Interfaccia utente inizializzata');
});

// Utility functions globali
window.UIUtils = {
    showToast: (message, type, duration) => {
        if (window.ui) {
            window.ui.showToast(message, type, duration);
        }
    },
    
    showModal: (id, content, options) => {
        if (window.ui) {
            return window.ui.showModal(id, content, options);
        }
    },
    
    closeModal: (id) => {
        if (window.ui) {
            window.ui.closeModal(id);
        }
    },
    
    copyToClipboard: (text) => {
        if (window.ui) {
            return window.ui.copyToClipboard(text);
        }
    },
    
    shareContent: (data) => {
        if (window.ui) {
            return window.ui.shareContent(data);
        }
    }
};

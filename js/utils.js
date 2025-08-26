/**
 * Utils - Wali Wheelse
 * Funzioni di utilità comuni per tutto il sito
 */

// Utility per formattazione
const Utils = {
    // Formatta prezzo in euro
    formatPrice: (price) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    },

    // Formatta numero con separatori
    formatNumber: (num) => {
        return new Intl.NumberFormat('it-IT').format(num);
    },

    // Capitalizza prima lettera
    capitalizeFirst: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Genera ID univoco
    generateId: () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
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
    },

    // Verifica se elemento è visibile
    isElementInViewport: (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Verifica se dispositivo è mobile
    isMobile: () => {
        return window.innerWidth <= 768;
    },

    // Verifica se dispositivo è tablet
    isTablet: () => {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    // Verifica se dispositivo è desktop
    isDesktop: () => {
        return window.innerWidth > 1024;
    },

    // Aggiungi classe CSS con animazione
    addClassWithAnimation: (element, className, duration = 300) => {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    },

    // Verifica se localStorage è disponibile
    isLocalStorageAvailable: () => {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Salva dati in localStorage con gestione errori
    safeLocalStorageSet: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Errore salvataggio localStorage:', e);
            return false;
        }
    },

    // Carica dati da localStorage con gestione errori
    safeLocalStorageGet: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Errore caricamento localStorage:', e);
            return defaultValue;
        }
    },

    // Rimuove dati da localStorage con gestione errori
    safeLocalStorageRemove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Errore rimozione localStorage:', e);
            return false;
        }
    },

    // Mostra toast notification
    showToast: (message, type = 'info', duration = 3000) => {
        // Crea elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Aggiungi stili
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Aggiungi al DOM
        document.body.appendChild(toast);

        // Anima entrata
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Event listener per chiusura
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            removeToast();
        });

        // Auto-remove
        setTimeout(removeToast, duration);

        function removeToast() {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    },

    // Verifica se stringa è email valida
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Verifica se stringa è numero di telefono valido
    isValidPhone: (phone) => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    },

    // Formatta numero di telefono
    formatPhone: (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    },

    // Verifica se oggetto è vuoto
    isEmpty: (obj) => {
        if (obj === null || obj === undefined) return true;
        if (typeof obj === 'string') return obj.trim().length === 0;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    },

    // Clona oggetto profondo
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }
};

// Esporta per uso globale
window.Utils = Utils;

// Console log per debug
console.log('🚀 Utils.js caricato - Wali Wheelse');

/**
 * Wali Wheels - Site Optimizer & Performance Enhancer
 * Sistema completo di ottimizzazione per garantire funzionamento al 100%
 * Versione 1.0 - Ottimizzazione Globale
 */

class SiteOptimizer {
    constructor() {
        this.performanceMetrics = {};
        this.optimizationStatus = {};
        this.init();
    }

    init() {
        console.log('🚀 Site Optimizer inizializzato');
        this.optimizePerformance();
        this.optimizeAccessibility();
        this.optimizeInteractivity();
        this.monitorPerformance();
        this.setupErrorHandling();
        this.optimizeImages();
        this.optimizeForms();
        this.optimizeNavigation();
    }

    // ===== OTTIMIZZAZIONE PRESTAZIONI =====
    
    optimizePerformance() {
        // Lazy loading per immagini
        this.setupLazyLoading();
        
        // Preload risorse critiche
        this.preloadCriticalResources();
        
        // Ottimizzazione CSS e JS
        this.optimizeResourceLoading();
        
        // Caching intelligente
        this.setupSmartCaching();
        
        console.log('✅ Ottimizzazione prestazioni completata');
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload CSS critici
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = 'css/styles.css';
        criticalCSS.as = 'style';
        document.head.appendChild(criticalCSS);

        // Preload font critici
        const criticalFont = document.createElement('link');
        criticalFont.rel = 'preload';
        criticalFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        criticalFont.as = 'style';
        document.head.appendChild(criticalFont);
    }

    optimizeResourceLoading() {
        // Defer script non critici
        const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
        nonCriticalScripts.forEach(script => {
            script.defer = true;
        });

        // Async per script esterni
        const externalScripts = document.querySelectorAll('script[src*="cdnjs.cloudflare.com"]');
        externalScripts.forEach(script => {
            script.async = true;
        });
    }

    setupSmartCaching() {
        // Cache per localStorage
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }

        // Cache per immagini
        this.cacheImages();
    }

    cacheImages() {
        const imageCache = new Map();
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.src && !imageCache.has(img.src)) {
                imageCache.set(img.src, true);
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = img.src;
                document.head.appendChild(link);
            }
        });
    }

    // ===== OTTIMIZZAZIONE ACCESSIBILITÀ =====
    
    optimizeAccessibility() {
        // WAI-ARIA attributes
        this.addWaiAriaAttributes();
        
        // Focus management
        this.setupFocusManagement();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader support
        this.optimizeScreenReaderSupport();
        
        console.log('✅ Ottimizzazione accessibilità completata');
    }

    addWaiAriaAttributes() {
        // Pulsanti
        const buttons = document.querySelectorAll('button, .btn, .glass-button');
        buttons.forEach((button, index) => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent || `Pulsante ${index + 1}`);
            }
            button.setAttribute('role', 'button');
        });

        // Form inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'hidden') {
                input.setAttribute('aria-describedby', `${input.id}-help`);
            }
        });

        // Navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Menu principale');
        }
    }

    setupFocusManagement() {
        // Focus visible per tutti gli elementi interattivi
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');
        interactiveElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focus-visible');
            });
            element.addEventListener('blur', () => {
                element.classList.remove('focus-visible');
            });
        });

        // Skip to content link
        this.addSkipToContentLink();
    }

    addSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Salta al contenuto principale';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupKeyboardNavigation() {
        // Navigazione con tab
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Navigazione con frecce
        this.setupArrowNavigation();
    }

    setupArrowNavigation() {
        const carousels = document.querySelectorAll('.carousel, .swiper-container');
        carousels.forEach(carousel => {
            carousel.addEventListener('keydown', (e) => {
                const slides = carousel.querySelectorAll('.slide, .swiper-slide');
                const currentSlide = carousel.querySelector('.active, .swiper-slide-active');
                let currentIndex = Array.from(slides).indexOf(currentSlide);
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
                    this.activateSlide(slides[currentIndex], carousel);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
                    this.activateSlide(slides[currentIndex], carousel);
                }
            });
        });
    }

    activateSlide(slide, carousel) {
        carousel.querySelectorAll('.slide, .swiper-slide').forEach(s => {
            s.classList.remove('active', 'swiper-slide-active');
        });
        slide.classList.add('active', 'swiper-slide-active');
        slide.focus();
    }

    optimizeScreenReaderSupport() {
        // Testo alternativo per immagini
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (!img.alt) {
                img.alt = 'Immagine descrittiva';
            }
        });

        // Live regions per notifiche
        this.setupLiveRegions();
    }

    setupLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
        
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
        };
    }

    // ===== OTTIMIZZAZIONE INTERATTIVITÀ =====
    
    optimizeInteractivity() {
        // Microinterazioni
        this.setupMicrointeractions();
        
        // Feedback visivo
        this.setupVisualFeedback();
        
        // Animazioni fluide
        this.optimizeAnimations();
        
        // Gestione errori
        this.setupErrorHandling();
        
        console.log('✅ Ottimizzazione interattività completata');
    }

    setupMicrointeractions() {
        // Hover effects per tutti gli elementi interattivi
        const interactiveElements = document.querySelectorAll('button, a, .card, .car-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px) scale(1.02)';
                element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Click feedback
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, a, .btn')) {
                this.createRippleEffect(e);
            }
        });
    }

    createRippleEffect(event) {
        const button = event.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupVisualFeedback() {
        // Loading states
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        });

        // Success/error states
        this.setupStatusIndicators();
    }

    setupStatusIndicators() {
        // Toast notifications
        window.showToast = (message, type = 'info') => {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#40E0D0' : type === 'error' ? '#ff6b6b' : '#667eea'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => toast.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        };
    }

    optimizeAnimations() {
        // Smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Intersection Observer per animazioni
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up');
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // ===== MONITORAGGIO PRESTAZIONI =====
    
    monitorPerformance() {
        // Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Resource timing
        this.monitorResourceTiming();
        
        // Error tracking
        this.trackErrors();
        
        console.log('✅ Monitoraggio prestazioni attivato');
    }

    monitorCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            // LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                console.log('📊 LCP:', lastEntry.startTime.toFixed(2), 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // FID (First Input Delay)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // CLS (Cumulative Layout Shift)
            const clsObserver = new PerformanceObserver((list) => {
                let cls = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                });
                this.performanceMetrics.cls = cls;
                console.log('📊 CLS:', cls.toFixed(4));
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.initiatorType === 'img' && entry.duration > 1000) {
                        console.warn('⚠️ Immagine lenta:', entry.name, entry.duration.toFixed(2), 'ms');
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    trackErrors() {
        window.addEventListener('error', (e) => {
            console.error('❌ Errore JavaScript:', e.error);
            this.performanceMetrics.errors = (this.performanceMetrics.errors || 0) + 1;
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Promise rifiutata:', e.reason);
            this.performanceMetrics.promiseErrors = (this.performanceMetrics.promiseErrors || 0) + 1;
        });
    }

    // ===== GESTIONE ERRORI =====
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', this.handleGlobalError.bind(this));
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        
        // Network error handler
        this.setupNetworkErrorHandling();
        
        console.log('✅ Gestione errori configurata');
    }

    handleGlobalError(error) {
        console.error('❌ Errore globale:', error);
        
        // Mostra notifica utente
        if (window.showToast) {
            window.showToast('Si è verificato un errore. Riprova più tardi.', 'error');
        }
        
        // Log per analytics
        this.logError('global', error.message, error.filename, error.lineno);
    }

    handlePromiseRejection(event) {
        console.error('❌ Promise rifiutata:', event.reason);
        
        // Mostra notifica utente
        if (window.showToast) {
            window.showToast('Operazione non completata. Riprova.', 'error');
        }
        
        // Log per analytics
        this.logError('promise', event.reason, '', 0);
    }

    setupNetworkErrorHandling() {
        // Interceptor per fetch
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response;
            } catch (error) {
                console.error('❌ Errore di rete:', error);
                
                if (window.showToast) {
                    window.showToast('Errore di connessione. Verifica la tua connessione.', 'error');
                }
                
                throw error;
            }
        };
    }

    logError(type, message, filename, lineno) {
        const errorLog = {
            type,
            message,
            filename,
            lineno,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Salva in localStorage per debug
        const errors = JSON.parse(localStorage.getItem('waliwheels_errors') || '[]');
        errors.push(errorLog);
        localStorage.setItem('waliwheels_errors', JSON.stringify(errors.slice(-100)));
    }

    // ===== OTTIMIZZAZIONE IMMAGINI =====
    
    optimizeImages() {
        // Lazy loading per tutte le immagini
        this.setupImageLazyLoading();
        
        // Compressione automatica
        this.setupImageCompression();
        
        // WebP support
        this.setupWebPSupport();
        
        console.log('✅ Ottimizzazione immagini completata');
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    setupImageCompression() {
        // Compressione automatica per immagini caricate
        const compressImage = (file) => {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    const maxWidth = 1200;
                    const maxHeight = 800;
                    let { width, height } = img;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(resolve, 'image/jpeg', 0.8);
                };
                
                img.src = URL.createObjectURL(file);
            });
        };
        
        window.compressImage = compressImage;
    }

    setupWebPSupport() {
        // Controlla supporto WebP
        const webpSupported = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;
        
        if (webpSupported) {
            document.documentElement.classList.add('webp-supported');
        }
    }

    // ===== OTTIMIZZAZIONE FORM =====
    
    optimizeForms() {
        // Validazione real-time
        this.setupFormValidation();
        
        // Auto-save
        this.setupFormAutoSave();
        
        // Gestione errori
        this.setupFormErrorHandling();
        
        console.log('✅ Ottimizzazione form completata');
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
            
            form.addEventListener('submit', (e) => this.validateForm(e));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Validazione campi obbligatori
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Questo campo è obbligatorio';
        }
        
        // Validazione email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email non valida';
            }
        }
        
        // Validazione telefono
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Numero di telefono non valido';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #ff6b6b; font-size: 0.8rem; margin-top: 0.25rem;';
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    validateForm(event) {
        const form = event.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            event.preventDefault();
            if (window.showToast) {
                window.showToast('Correggi gli errori nel form', 'error');
            }
        }
        
        return isValid;
    }

    setupFormAutoSave() {
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            const formId = form.dataset.autosave;
            const savedData = localStorage.getItem(`form_${formId}`);
            
            if (savedData) {
                this.restoreFormData(form, JSON.parse(savedData));
            }
            
            form.addEventListener('input', () => {
                this.saveFormData(form, formId);
            });
        });
    }

    saveFormData(form, formId) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem(`form_${formId}`, JSON.stringify(data));
    }

    restoreFormData(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }

    setupFormErrorHandling() {
        // Gestione errori di invio
        window.addEventListener('form-error', (e) => {
            if (window.showToast) {
                window.showToast(e.detail.message, 'error');
            }
        });
    }

    // ===== OTTIMIZZAZIONE NAVIGAZIONE =====
    
    optimizeNavigation() {
        // Preload pagine
        this.setupPagePreloading();
        
        // Cache navigazione
        this.setupNavigationCache();
        
        // Smooth transitions
        this.setupSmoothTransitions();
        
        console.log('✅ Ottimizzazione navigazione completata');
    }

    setupPagePreloading() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.hostname === window.location.hostname) {
                link.addEventListener('mouseenter', () => {
                    this.preloadPage(link.href);
                });
            }
        });
    }

    preloadPage(url) {
        if (!this.preloadedPages.has(url)) {
            this.preloadedPages = new Set();
            this.preloadedPages.add(url);
            
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }
    }

    setupNavigationCache() {
        // Cache per pagine visitate
        this.visitedPages = new Set();
        
        // Salva stato pagina corrente
        window.addEventListener('beforeunload', () => {
            this.savePageState();
        });
        
        // Ripristina stato pagina
        window.addEventListener('load', () => {
            this.restorePageState();
        });
    }

    savePageState() {
        const state = {
            scrollY: window.scrollY,
            formData: this.getFormData(),
            timestamp: Date.now()
        };
        
        localStorage.setItem(`page_state_${window.location.pathname}`, JSON.stringify(state));
    }

    restorePageState() {
        const savedState = localStorage.getItem(`page_state_${window.location.pathname}`);
        if (savedState) {
            const state = JSON.parse(savedState);
            
            // Ripristina scroll se la pagina è stata caricata recentemente
            if (Date.now() - state.timestamp < 300000) { // 5 minuti
                setTimeout(() => {
                    window.scrollTo(0, state.scrollY);
                }, 100);
            }
            
            // Ripristina dati form
            this.restoreFormDataFromState(state.formData);
        }
    }

    getFormData() {
        const forms = document.querySelectorAll('form');
        const formData = {};
        
        forms.forEach((form, index) => {
            const data = new FormData(form);
            formData[index] = {};
            
            for (let [key, value] of data.entries()) {
                formData[index][key] = value;
            }
        });
        
        return formData;
    }

    restoreFormDataFromState(formData) {
        Object.keys(formData).forEach(formIndex => {
            const form = document.querySelectorAll('form')[formIndex];
            if (form) {
                this.restoreFormData(form, formData[formIndex]);
            }
        });
    }

    setupSmoothTransitions() {
        // Transizioni fluide tra pagine
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Animazioni di entrata
        const entranceElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
        const entranceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('entered');
                }
            });
        });
        
        entranceElements.forEach(el => entranceObserver.observe(el));
    }

    // ===== UTILITY METHODS =====
    
    getOptimizationStatus() {
        return {
            performance: this.performanceMetrics,
            status: this.optimizationStatus,
            timestamp: new Date().toISOString()
        };
    }

    exportPerformanceReport() {
        const report = this.getOptimizationStatus();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `waliwheels-performance-report-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // ===== INIZIALIZZAZIONE =====
    
    static getInstance() {
        if (!SiteOptimizer.instance) {
            SiteOptimizer.instance = new SiteOptimizer();
        }
        return SiteOptimizer.instance;
    }
}

// Inizializzazione automatica
document.addEventListener('DOMContentLoaded', () => {
    window.siteOptimizer = SiteOptimizer.getInstance();
});

// Esporta per uso globale
window.SiteOptimizer = SiteOptimizer;











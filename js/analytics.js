/**
 * Analytics NUCLEARE - Wali Wheelse
 * Sistema completo di tracking e analisi
 */

class AnalyticsNucleare {
    constructor() {
        this.events = [];
        this.performance = {};
        this.userBehavior = {};
        this.init();
    }
    
    init() {
        console.log('📊 Analytics NUCLEARE attivato');
        
        // Inizializza Google Analytics 4
        this.initGoogleAnalytics();
        
        // Tracking performance
        this.trackPerformance();
        
        // Tracking comportamento utente
        this.trackUserBehavior();
        
        // Tracking conversioni
        this.trackConversions();
        
        // Core Web Vitals
        this.trackCoreWebVitals();
        
        // Error tracking
        this.trackErrors();
        
        // Custom events
        this.initCustomEvents();
    }
    
    initGoogleAnalytics() {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                    'custom_parameter_1': 'car_brand',
                    'custom_parameter_2': 'car_price_range',
                    'custom_parameter_3': 'user_action'
                }
            });
            
            console.log('✅ Google Analytics 4 configurato');
        } else {
            console.log('⚠️ Google Analytics non disponibile');
        }
    }
    
    trackPerformance() {
        // Performance API
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const paintData = performance.getEntriesByType('paint');
                    
                    this.performance = {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: paintData.find(p => p.name === 'first-paint')?.startTime || 0,
                        firstContentfulPaint: paintData.find(p => p.name === 'first-contentful-paint')?.startTime || 0
                    };
                    
                    console.log('📊 Performance metrics:', this.performance);
                    this.sendEvent('performance', this.performance);
                }, 1000);
            });
        }
    }
    
    trackUserBehavior() {
        // Scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Ogni 25%
                    this.sendEvent('scroll_depth', { depth: maxScroll });
                }
            }
        }, 100));
        
        // Time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.sendEvent('time_on_page', { seconds: Math.round(timeOnPage / 1000) });
        });
        
        // Click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, .car-card, .filter-option');
            if (target) {
                this.trackClick(target);
            }
        });
        
        // Form interactions
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.sendEvent('form_interaction', {
                    field: e.target.name || e.target.id || 'unknown',
                    action: 'input'
                });
            }
        });
    }
    
    trackClick(element) {
        const data = {
            element: element.tagName.toLowerCase(),
            text: element.textContent?.trim().substring(0, 50) || '',
            classes: Array.from(element.classList).join(' '),
            href: element.href || '',
            position: this.getElementPosition(element)
        };
        
        this.sendEvent('click', data);
    }
    
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
    
    trackConversions() {
        // Test drive requests
        this.trackConversion('test_drive_request', '.test-drive-btn');
        
        // Contact form submissions
        this.trackConversion('contact_form', 'form[action*="contact"]');
        
        // Car detail views
        this.trackConversion('car_detail_view', '.car-card');
        
        // Filter usage
        this.trackConversion('filter_usage', '.filter-input, .filter-select');
        
        // Search queries
        this.trackConversion('search_query', '.search-input');
    }
    
    trackConversion(type, selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', () => {
                this.sendEvent('conversion', { type, element: selector });
            });
        });
    }
    
    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.sendEvent('core_web_vital', {
                    metric: 'LCP',
                    value: lastEntry.startTime,
                    rating: this.getRating(lastEntry.startTime, [2500, 4000])
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.sendEvent('core_web_vital', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime,
                        rating: this.getRating(entry.processingStart - entry.startTime, [100, 300])
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.sendEvent('core_web_vital', {
                    metric: 'CLS',
                    value: clsValue,
                    rating: this.getRating(clsValue, [0.1, 0.25])
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    getRating(value, thresholds) {
        if (value <= thresholds[0]) return 'good';
        if (value <= thresholds[1]) return 'needs_improvement';
        return 'poor';
    }
    
    trackErrors() {
        // JavaScript errors
        window.addEventListener('error', (e) => {
            this.sendEvent('error', {
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.sendEvent('error', {
                type: 'promise_rejection',
                reason: e.reason
            });
        });
        
        // Resource loading errors
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.sendEvent('error', {
                    type: 'resource_loading',
                    resource: e.target.src || e.target.href,
                    tag: e.target.tagName
                });
            }
        }, true);
    }
    
    initCustomEvents() {
        // Car comparison
        this.trackCustomEvent('car_comparison', '.compare-btn');
        
        // Favorites
        this.trackCustomEvent('favorite_added', '.favorite-btn');
        
        // Filter changes
        this.trackCustomEvent('filter_changed', '.filter-input, .filter-select');
        
        // View mode changes
        this.trackCustomEvent('view_mode_changed', '.view-toggle');
        
        // Pagination
        this.trackCustomEvent('pagination', '.pagination-btn');
    }
    
    trackCustomEvent(eventName, selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', () => {
                this.sendEvent(eventName, {
                    element: selector,
                    value: element.textContent?.trim() || ''
                });
            });
        });
    }
    
    sendEvent(eventName, data) {
        const event = {
            timestamp: Date.now(),
            event: eventName,
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        this.events.push(event);
        
        // Invia a Google Analytics se disponibile
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Log locale per debug
        console.log(`📊 Event: ${eventName}`, data);
        
        // Salva in localStorage per analisi offline
        this.saveEvent(event);
    }
    
    saveEvent(event) {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push(event);
            
            // Mantieni solo gli ultimi 1000 eventi
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (e) {
            console.error('Errore salvataggio evento analytics:', e);
        }
    }
    
    getAnalyticsReport() {
        return {
            events: this.events,
            performance: this.performance,
            userBehavior: this.userBehavior,
            totalEvents: this.events.length,
            sessionDuration: Date.now() - (this.sessionStart || Date.now())
        };
    }
    
    exportData() {
        const data = this.getAnalyticsReport();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Inizializza analytics
window.AnalyticsNucleare = new AnalyticsNucleare();

// Console log per debug
console.log('🚀 Analytics NUCLEARE caricato - Wali Wheelse');


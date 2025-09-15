/**
 * Advanced Performance Optimizer
 * Handles caching, lazy loading, compression, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.cache = new Map();
        this.imageCache = new Map();
        this.observers = new Map();
        this.metrics = {
            pageLoadTime: 0,
            resourceLoadTimes: [],
            cacheHits: 0,
            cacheMisses: 0,
            lazyLoadedImages: 0,
            optimizedImages: 0
        };
        this.config = {
            cacheExpiry: 5 * 60 * 1000, // 5 minutes
            imageQuality: 0.8,
            lazyLoadOffset: '50px',
            preloadCount: 3,
            compressionEnabled: true,
            webpSupported: false
        };
        
        this.init();
    }

    init() {
        this.detectFeatureSupport();
        this.setupCaching();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourcePreloading();
        this.setupPerformanceMonitoring();
        this.setupServiceWorker();
        this.optimizeExistingContent();
    }

    // ===== FEATURE DETECTION =====
    
    detectFeatureSupport() {
        // WebP support
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.config.webpSupported = canvas.toDataURL('image/webp').indexOf('webp') !== -1;
        
        // Intersection Observer support
        this.intersectionObserverSupported = 'IntersectionObserver' in window;
        
        // Service Worker support
        this.serviceWorkerSupported = 'serviceWorker' in navigator;
        
        // Local Storage support
        this.localStorageSupported = this.testLocalStorage();
        
        console.log('🔍 Feature Detection:', {
            webp: this.config.webpSupported,
            intersectionObserver: this.intersectionObserverSupported,
            serviceWorker: this.serviceWorkerSupported,
            localStorage: this.localStorageSupported
        });
    }
    
    testLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // ===== CACHING SYSTEM =====
    
    setupCaching() {
        if (!this.localStorageSupported) return;
        
        // Load existing cache
        this.loadCacheFromStorage();
        
        // Set up cache cleanup
        setInterval(() => {
            this.cleanupExpiredCache();
        }, 60000); // Check every minute
        
        // Save cache before page unload
        window.addEventListener('beforeunload', () => {
            this.saveCacheToStorage();
        });
    }
    
    loadCacheFromStorage() {
        try {
            const cachedData = localStorage.getItem('performance_cache');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                Object.entries(parsed).forEach(([key, value]) => {
                    if (value.expires > Date.now()) {
                        this.cache.set(key, value);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to load cache from storage:', e);
        }
    }
    
    saveCacheToStorage() {
        try {
            const cacheObject = {};
            this.cache.forEach((value, key) => {
                if (value.expires > Date.now()) {
                    cacheObject[key] = value;
                }
            });
            localStorage.setItem('performance_cache', JSON.stringify(cacheObject));
        } catch (e) {
            console.warn('Failed to save cache to storage:', e);
        }
    }
    
    cleanupExpiredCache() {
        const now = Date.now();
        const expiredKeys = [];
        
        this.cache.forEach((value, key) => {
            if (value.expires <= now) {
                expiredKeys.push(key);
            }
        });
        
        expiredKeys.forEach(key => {
            this.cache.delete(key);
        });
        
        if (expiredKeys.length > 0) {
            console.log(`🗑️ Cleaned up ${expiredKeys.length} expired cache entries`);
        }
    }
    
    setCache(key, data, customExpiry = null) {
        const expires = Date.now() + (customExpiry || this.config.cacheExpiry);
        this.cache.set(key, {
            data: data,
            expires: expires,
            timestamp: Date.now()
        });
    }
    
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expires > Date.now()) {
            this.metrics.cacheHits++;
            return cached.data;
        }
        
        if (cached) {
            this.cache.delete(key);
        }
        
        this.metrics.cacheMisses++;
        return null;
    }

    // ===== LAZY LOADING =====
    
    setupLazyLoading() {
        if (!this.intersectionObserverSupported) {
            // Fallback for older browsers
            this.setupScrollBasedLazyLoading();
            return;
        }
        
        // Images
        this.imageObserver = new IntersectionObserver(
            this.handleImageIntersection.bind(this),
            {
                rootMargin: this.config.lazyLoadOffset,
                threshold: 0.1
            }
        );
        
        // Content sections
        this.contentObserver = new IntersectionObserver(
            this.handleContentIntersection.bind(this),
            {
                rootMargin: '100px',
                threshold: 0.1
            }
        );
        
        this.observeExistingElements();
        this.setupMutationObserver();
    }
    
    observeExistingElements() {
        // Observe images
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            this.imageObserver.observe(img);
        });
        
        // Observe content sections
        document.querySelectorAll('[data-lazy-load]').forEach(element => {
            this.contentObserver.observe(element);
        });
    }
    
    setupMutationObserver() {
        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Observe new images
                            if (node.matches && node.matches('img[data-src], img[loading="lazy"]')) {
                                this.imageObserver.observe(node);
                            }
                            
                            // Observe new lazy content
                            if (node.matches && node.matches('[data-lazy-load]')) {
                                this.contentObserver.observe(node);
                            }
                            
                            // Observe images within new elements
                            const lazyImages = node.querySelectorAll && node.querySelectorAll('img[data-src], img[loading="lazy"]');
                            if (lazyImages) {
                                lazyImages.forEach(img => this.imageObserver.observe(img));
                            }
                            
                            // Observe lazy content within new elements
                            const lazyContent = node.querySelectorAll && node.querySelectorAll('[data-lazy-load]');
                            if (lazyContent) {
                                lazyContent.forEach(element => this.contentObserver.observe(element));
                            }
                        }
                    });
                });
            });
            
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    handleImageIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadLazyImage(entry.target);
                this.imageObserver.unobserve(entry.target);
            }
        });
    }
    
    handleContentIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadLazyContent(entry.target);
                this.contentObserver.unobserve(entry.target);
            }
        });
    }
    
    loadLazyImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;
        
        // Create optimized image URL
        const optimizedSrc = this.getOptimizedImageUrl(src);
        
        // Show loading state
        img.classList.add('loading');
        
        // Create new image to preload
        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = optimizedSrc;
            img.classList.remove('loading');
            img.classList.add('loaded');
            this.metrics.lazyLoadedImages++;
            
            // Remove data-src to prevent reprocessing
            if (img.dataset.src) {
                delete img.dataset.src;
            }
            
            // Trigger custom event
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { src: optimizedSrc, originalSrc: src }
            }));
        };
        
        newImg.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.warn('Failed to load lazy image:', src);
        };
        
        newImg.src = optimizedSrc;
    }
    
    loadLazyContent(element) {
        const contentUrl = element.dataset.lazyLoad;
        if (!contentUrl) return;
        
        // Check cache first
        const cached = this.getCache(`content_${contentUrl}`);
        if (cached) {
            this.insertLazyContent(element, cached);
            return;
        }
        
        // Show loading state
        element.classList.add('loading');
        element.innerHTML = '<div class="lazy-loading"><div class="loading-spinner"></div></div>';
        
        // Fetch content
        fetch(contentUrl)
            .then(response => response.text())
            .then(html => {
                this.setCache(`content_${contentUrl}`, html);
                this.insertLazyContent(element, html);
            })
            .catch(error => {
                console.warn('Failed to load lazy content:', error);
                element.classList.add('error');
                element.innerHTML = '<div class="lazy-error">Failed to load content</div>';
            });
    }
    
    insertLazyContent(element, html) {
        element.innerHTML = html;
        element.classList.remove('loading');
        element.classList.add('loaded');
        
        // Initialize any new components in the loaded content
        this.initializeLoadedContent(element);
    }
    
    initializeLoadedContent(container) {
        // Re-observe any new lazy elements
        const newLazyImages = container.querySelectorAll('img[data-src]');
        newLazyImages.forEach(img => this.imageObserver.observe(img));
        
        const newLazyContent = container.querySelectorAll('[data-lazy-load]');
        newLazyContent.forEach(element => this.contentObserver.observe(element));
        
        // Trigger content loaded event
        container.dispatchEvent(new CustomEvent('contentLoaded'));
    }

    // ===== IMAGE OPTIMIZATION =====
    
    setupImageOptimization() {
        this.createImageOptimizationStyles();
    }
    
    createImageOptimizationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            img.loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 2s infinite;
                min-height: 100px;
            }
            
            img.loaded {
                animation: fadeIn 0.3s ease-in-out;
            }
            
            img.error {
                background: #f5f5f5;
                color: #999;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100px;
            }
            
            img.error::after {
                content: "⚠️ Image not available";
                font-size: 14px;
            }
            
            @keyframes loading-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .lazy-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            
            .lazy-error {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100px;
                background: rgba(255, 0, 0, 0.1);
                color: #ff4757;
                border-radius: 8px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }
    
    getOptimizedImageUrl(originalUrl) {
        // If it's already a data URL or external URL, return as is
        if (originalUrl.startsWith('data:') || originalUrl.startsWith('http')) {
            return originalUrl;
        }
        
        // For local images, we could implement various optimizations
        // This is a placeholder for more advanced image optimization
        let optimizedUrl = originalUrl;
        
        // Add WebP support if available
        if (this.config.webpSupported && !originalUrl.includes('.webp')) {
            const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            // In a real implementation, you'd check if the WebP version exists
            optimizedUrl = webpUrl;
        }
        
        this.metrics.optimizedImages++;
        return optimizedUrl;
    }

    // ===== RESOURCE PRELOADING =====
    
    setupResourcePreloading() {
        this.preloadCriticalResources();
        this.setupIntelligentPreloading();
    }
    
    preloadCriticalResources() {
        // Preload critical CSS
        const criticalStyles = [
            'css/styles.css',
            'css/advanced-ui.css'
        ];
        
        criticalStyles.forEach(href => {
            this.preloadResource(href, 'style');
        });
        
        // Preload critical JavaScript
        const criticalScripts = [
            'js/main.js',
            'js/advanced-features.js'
        ];
        
        criticalScripts.forEach(href => {
            this.preloadResource(href, 'script');
        });
    }
    
    preloadResource(href, as, crossorigin = null) {
        // Check if already preloaded
        if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
            return;
        }
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        if (crossorigin) {
            link.crossOrigin = crossorigin;
        }
        
        link.onload = () => {
            console.log(`✅ Preloaded: ${href}`);
        };
        
        link.onerror = () => {
            console.warn(`❌ Failed to preload: ${href}`);
        };
        
        document.head.appendChild(link);
    }
    
    setupIntelligentPreloading() {
        // Preload resources based on user behavior
        let mouseOverTimer;
        
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href]');
            if (link && link.href && !link.href.startsWith('#')) {
                mouseOverTimer = setTimeout(() => {
                    this.preloadPage(link.href);
                }, 100); // Preload after 100ms of hover
            }
        });
        
        document.addEventListener('mouseout', () => {
            clearTimeout(mouseOverTimer);
        });
        
        // Preload resources when they come into viewport
        if (this.intersectionObserverSupported) {
            const preloadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const href = element.href || element.dataset.preload;
                        if (href) {
                            this.preloadPage(href);
                            preloadObserver.unobserve(element);
                        }
                    }
                });
            }, { rootMargin: '200px' });
            
            document.querySelectorAll('a[href], [data-preload]').forEach(element => {
                preloadObserver.observe(element);
            });
        }
    }
    
    preloadPage(url) {
        // Don't preload external URLs or already preloaded pages
        if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
            return;
        }
        
        if (this.getCache(`page_${url}`)) {
            return;
        }
        
        fetch(url, { method: 'GET' })
            .then(response => response.text())
            .then(html => {
                this.setCache(`page_${url}`, html, 10 * 60 * 1000); // Cache for 10 minutes
                console.log(`🔄 Preloaded page: ${url}`);
            })
            .catch(error => {
                console.warn(`Failed to preload page: ${url}`, error);
            });
    }

    // ===== PERFORMANCE MONITORING =====
    
    setupPerformanceMonitoring() {
        // Monitor page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.measurePagePerformance();
            }, 0);
        });
        
        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }
        
        // Monitor memory usage
        this.setupMemoryMonitoring();
        
        // Monitor frame rate
        this.setupFrameRateMonitoring();
    }
    
    measurePagePerformance() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
                
                console.log('📊 Page Performance:', {
                    loadTime: this.metrics.pageLoadTime + 'ms',
                    domContentLoaded: (navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) + 'ms',
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint()
                });
            }
        }
    }
    
    setupPerformanceObserver() {
        try {
            // Observe resource loading
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.metrics.resourceLoadTimes.push({
                        name: entry.name,
                        duration: entry.duration,
                        type: entry.initiatorType
                    });
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            
            // Observe largest contentful paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('🎨 Largest Contentful Paint:', lastEntry.startTime + 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Observe first input delay
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log('⚡ First Input Delay:', entry.processingStart - entry.startTime + 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
        } catch (e) {
            console.warn('Performance Observer not fully supported:', e);
        }
    }
    
    getFirstPaint() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            const fp = paintEntries.find(entry => entry.name === 'first-paint');
            return fp ? fp.startTime + 'ms' : 'N/A';
        }
        return 'N/A';
    }
    
    getFirstContentfulPaint() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return fcp ? fcp.startTime + 'ms' : 'N/A';
        }
        return 'N/A';
    }
    
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = memory.usedJSHeapSize / 1048576;
                const totalMB = memory.totalJSHeapSize / 1048576;
                
                if (usedMB > 100) { // Alert if using more than 100MB
                    console.warn('🚨 High memory usage:', {
                        used: usedMB.toFixed(2) + 'MB',
                        total: totalMB.toFixed(2) + 'MB'
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    setupFrameRateMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) { // Every second
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) { // Alert if FPS drops below 30
                    console.warn('🐌 Low frame rate detected:', fps + ' FPS');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    // ===== SERVICE WORKER =====
    
    setupServiceWorker() {
        if (!this.serviceWorkerSupported) return;
        
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New update available
                            this.showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.warn('❌ Service Worker registration failed:', error);
            });
    }
    
    showUpdateNotification() {
        if (window.advancedFeatures) {
            window.advancedFeatures.showNotification(
                'Aggiornamento disponibile',
                'Una nuova versione del sito è disponibile. Ricarica la pagina per ottenerla.',
                'info',
                10000
            );
        }
    }

    // ===== CONTENT OPTIMIZATION =====
    
    optimizeExistingContent() {
        // Optimize images that are already loaded
        document.querySelectorAll('img:not([data-src]):not([loading="lazy"])').forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                this.optimizeLoadedImage(img);
            } else {
                img.addEventListener('load', () => {
                    this.optimizeLoadedImage(img);
                });
            }
        });
        
        // Optimize text content
        this.optimizeTextContent();
        
        // Optimize forms
        this.optimizeForms();
    }
    
    optimizeLoadedImage(img) {
        // Add loading states for future interactions
        img.classList.add('optimized');
        
        // Implement progressive image loading for large images
        if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
            this.implementProgressiveLoading(img);
        }
    }
    
    implementProgressiveLoading(img) {
        // This is a placeholder for progressive image loading
        // In a real implementation, you'd generate different sized versions
        console.log('📸 Large image detected, implementing progressive loading:', img.src);
    }
    
    optimizeTextContent() {
        // Implement text compression for large text blocks
        document.querySelectorAll('p, div').forEach(element => {
            if (element.textContent.length > 1000) {
                element.setAttribute('data-long-content', 'true');
                // Could implement text truncation or "read more" functionality
            }
        });
    }
    
    optimizeForms() {
        // Add auto-save and validation optimizations
        document.querySelectorAll('form').forEach(form => {
            if (!form.hasAttribute('data-optimized')) {
                this.optimizeForm(form);
                form.setAttribute('data-optimized', 'true');
            }
        });
    }
    
    optimizeForm(form) {
        // Implement debounced validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            let validationTimeout;
            
            input.addEventListener('input', () => {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    this.validateField(input);
                }, 300);
            });
        });
    }
    
    validateField(input) {
        // Basic field validation
        const isValid = input.checkValidity();
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
    }

    // ===== UTILITY METHODS =====
    
    getMetrics() {
        return {
            ...this.metrics,
            cacheSize: this.cache.size,
            cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100
        };
    }
    
    clearCache() {
        this.cache.clear();
        this.imageCache.clear();
        if (this.localStorageSupported) {
            localStorage.removeItem('performance_cache');
        }
        console.log('🗑️ Performance cache cleared');
    }
    
    exportMetrics() {
        const metrics = this.getMetrics();
        const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize performance optimizer
let performanceOptimizer;

document.addEventListener('DOMContentLoaded', () => {
    performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer = performanceOptimizer;
    
    console.log('⚡ Performance Optimizer initialized successfully!');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

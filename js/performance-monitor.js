/**
 * Wali Wheels - Real-Time Performance Monitor
 * Sistema di monitoraggio prestazioni in tempo reale
 * Versione 1.0 - Monitoraggio Continuo
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            loadTime: 0,
            networkRequests: 0,
            errorCount: 0,
            coreWebVitals: {
                lcp: 0,
                fid: 0,
                cls: 0
            }
        };
        
        this.isMonitoring = false;
        this.displayElement = null;
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        console.log('📊 Performance Monitor inizializzato');
        this.setupPerformanceObservers();
        this.createDisplayElement();
        this.startMonitoring();
        this.bindEvents();
    }

    // ===== SETUP OBSERVERS =====
    
    setupPerformanceObservers() {
        if ('PerformanceObserver' in window) {
            // LCP Observer
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.coreWebVitals.lcp = Math.round(lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP Observer non supportato:', e);
            }

            // FID Observer
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.metrics.coreWebVitals.fid = Math.round(entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID Observer non supportato:', e);
            }

            // CLS Observer
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.metrics.coreWebVitals.cls = Math.round(clsValue * 1000) / 1000;
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS Observer non supportato:', e);
            }

            // Resource Observer
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    this.metrics.networkRequests += list.getEntries().length;
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Resource Observer non supportato:', e);
            }
        }
    }

    // ===== MONITORING =====
    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🚀 Avvio monitoraggio prestazioni...');
        
        // Update FPS
        this.startFPSMonitoring();
        
        // Update Memory
        this.startMemoryMonitoring();
        
        // Update Load Time
        this.updateLoadTime();
        
        // Update display every second
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.fpsInterval) {
            clearInterval(this.fpsInterval);
            this.fpsInterval = null;
        }
        
        console.log('⏹️ Monitoraggio prestazioni fermato');
    }

    startFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        
        const countFrame = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round(frames * 1000 / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(countFrame);
            }
        };
        
        requestAnimationFrame(countFrame);
    }

    startMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                if (this.isMonitoring) {
                    const memory = performance.memory;
                    this.metrics.memory = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                }
            }, 2000);
        }
    }

    updateLoadTime() {
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
        }
    }

    // ===== DISPLAY ELEMENT =====
    
    createDisplayElement() {
        // Rimuovi elemento esistente se presente
        const existing = document.getElementById('performance-monitor');
        if (existing) {
            existing.remove();
        }

        this.displayElement = document.createElement('div');
        this.displayElement.id = 'performance-monitor';
        this.displayElement.className = 'performance-monitor';
        
        this.displayElement.innerHTML = `
            <div class="perf-header">
                <span class="perf-title">📊 Performance</span>
                <div class="perf-controls">
                    <button class="perf-toggle" onclick="window.performanceMonitor.toggleDisplay()">📊</button>
                    <button class="perf-close" onclick="window.performanceMonitor.hide()">✕</button>
                </div>
            </div>
            <div class="perf-content">
                <div class="perf-metric">
                    <span class="perf-label">FPS:</span>
                    <span class="perf-value" id="fps-value">0</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">Memory:</span>
                    <span class="perf-value" id="memory-value">0 MB</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">Load:</span>
                    <span class="perf-value" id="load-value">0 ms</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">Requests:</span>
                    <span class="perf-value" id="requests-value">0</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">LCP:</span>
                    <span class="perf-value" id="lcp-value">0 ms</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">FID:</span>
                    <span class="perf-value" id="fid-value">0 ms</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">CLS:</span>
                    <span class="perf-value" id="cls-value">0</span>
                </div>
                <div class="perf-metric">
                    <span class="perf-label">Errors:</span>
                    <span class="perf-value" id="errors-value">0</span>
                </div>
            </div>
        `;

        // Aggiungi stili inline
        this.displayElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            color: white;
            border-radius: 12px;
            padding: 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(this.displayElement);
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('performance-monitor-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'performance-monitor-styles';
        styles.textContent = `
            .performance-monitor .perf-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: linear-gradient(135deg, #40E0D0 0%, #36c9b0 100%);
                border-radius: 12px 12px 0 0;
                font-weight: bold;
                font-size: 14px;
            }

            .performance-monitor .perf-controls {
                display: flex;
                gap: 8px;
            }

            .performance-monitor .perf-toggle,
            .performance-monitor .perf-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }

            .performance-monitor .perf-toggle:hover,
            .performance-monitor .perf-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .performance-monitor .perf-content {
                padding: 12px 16px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .performance-monitor.collapsed .perf-content {
                display: none;
            }

            .performance-monitor .perf-metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
            }

            .performance-monitor .perf-label {
                color: #ccc;
                font-weight: 500;
            }

            .performance-monitor .perf-value {
                color: #40E0D0;
                font-weight: bold;
                font-family: 'Monaco', 'Consolas', monospace;
            }

            .performance-monitor .perf-value.good {
                color: #00ff88;
            }

            .performance-monitor .perf-value.warning {
                color: #feca57;
            }

            .performance-monitor .perf-value.error {
                color: #ff6b6b;
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                .performance-monitor {
                    width: 250px;
                    right: 10px;
                    top: 10px;
                }

                .performance-monitor .perf-content {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    updateDisplay() {
        if (!this.displayElement) return;

        // Update FPS
        const fpsElement = document.getElementById('fps-value');
        if (fpsElement) {
            fpsElement.textContent = this.metrics.fps;
            fpsElement.className = 'perf-value ' + this.getFPSClass(this.metrics.fps);
        }

        // Update Memory
        const memoryElement = document.getElementById('memory-value');
        if (memoryElement) {
            memoryElement.textContent = `${this.metrics.memory} MB`;
            memoryElement.className = 'perf-value ' + this.getMemoryClass(this.metrics.memory);
        }

        // Update Load Time
        const loadElement = document.getElementById('load-value');
        if (loadElement) {
            loadElement.textContent = `${this.metrics.loadTime} ms`;
            loadElement.className = 'perf-value ' + this.getLoadTimeClass(this.metrics.loadTime);
        }

        // Update Network Requests
        const requestsElement = document.getElementById('requests-value');
        if (requestsElement) {
            requestsElement.textContent = this.metrics.networkRequests;
        }

        // Update Core Web Vitals
        const lcpElement = document.getElementById('lcp-value');
        if (lcpElement) {
            lcpElement.textContent = `${this.metrics.coreWebVitals.lcp} ms`;
            lcpElement.className = 'perf-value ' + this.getLCPClass(this.metrics.coreWebVitals.lcp);
        }

        const fidElement = document.getElementById('fid-value');
        if (fidElement) {
            fidElement.textContent = `${this.metrics.coreWebVitals.fid} ms`;
            fidElement.className = 'perf-value ' + this.getFIDClass(this.metrics.coreWebVitals.fid);
        }

        const clsElement = document.getElementById('cls-value');
        if (clsElement) {
            clsElement.textContent = this.metrics.coreWebVitals.cls;
            clsElement.className = 'perf-value ' + this.getCLSClass(this.metrics.coreWebVitals.cls);
        }

        // Update Errors
        const errorsElement = document.getElementById('errors-value');
        if (errorsElement) {
            errorsElement.textContent = this.metrics.errorCount;
            errorsElement.className = 'perf-value ' + (this.metrics.errorCount > 0 ? 'error' : 'good');
        }
    }

    // ===== CLASSIFICATION METHODS =====
    
    getFPSClass(fps) {
        if (fps >= 58) return 'good';
        if (fps >= 45) return 'warning';
        return 'error';
    }

    getMemoryClass(memory) {
        if (memory < 50) return 'good';
        if (memory < 100) return 'warning';
        return 'error';
    }

    getLoadTimeClass(loadTime) {
        if (loadTime < 3000) return 'good';
        if (loadTime < 5000) return 'warning';
        return 'error';
    }

    getLCPClass(lcp) {
        if (lcp < 2500) return 'good';
        if (lcp < 4000) return 'warning';
        return 'error';
    }

    getFIDClass(fid) {
        if (fid < 100) return 'good';
        if (fid < 300) return 'warning';
        return 'error';
    }

    getCLSClass(cls) {
        if (cls < 0.1) return 'good';
        if (cls < 0.25) return 'warning';
        return 'error';
    }

    // ===== EVENT HANDLING =====
    
    bindEvents() {
        // Track errors
        window.addEventListener('error', () => {
            this.metrics.errorCount++;
        });

        window.addEventListener('unhandledrejection', () => {
            this.metrics.errorCount++;
        });

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopMonitoring();
            } else {
                this.startMonitoring();
            }
        });
    }

    // ===== CONTROL METHODS =====
    
    show() {
        if (this.displayElement) {
            this.displayElement.style.display = 'block';
            this.displayElement.style.transform = 'translateX(0)';
        }
    }

    hide() {
        if (this.displayElement) {
            this.displayElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (this.displayElement) {
                    this.displayElement.style.display = 'none';
                }
            }, 300);
        }
    }

    toggleDisplay() {
        if (this.displayElement) {
            this.displayElement.classList.toggle('collapsed');
        }
    }

    // ===== REPORTING =====
    
    getMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
    }

    exportMetrics() {
        const data = this.getMetrics();
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `performance-metrics-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // ===== ALERTS =====
    
    checkAlerts() {
        const alerts = [];

        // FPS Alert
        if (this.metrics.fps < 30) {
            alerts.push({
                type: 'error',
                message: `FPS troppo bassi: ${this.metrics.fps}`,
                metric: 'fps',
                value: this.metrics.fps
            });
        }

        // Memory Alert
        if (this.metrics.memory > 100) {
            alerts.push({
                type: 'warning',
                message: `Utilizzo memoria elevato: ${this.metrics.memory}MB`,
                metric: 'memory',
                value: this.metrics.memory
            });
        }

        // LCP Alert
        if (this.metrics.coreWebVitals.lcp > 4000) {
            alerts.push({
                type: 'error',
                message: `LCP troppo alto: ${this.metrics.coreWebVitals.lcp}ms`,
                metric: 'lcp',
                value: this.metrics.coreWebVitals.lcp
            });
        }

        // CLS Alert
        if (this.metrics.coreWebVitals.cls > 0.25) {
            alerts.push({
                type: 'error',
                message: `CLS troppo alto: ${this.metrics.coreWebVitals.cls}`,
                metric: 'cls',
                value: this.metrics.coreWebVitals.cls
            });
        }

        // Error Alert
        if (this.metrics.errorCount > 5) {
            alerts.push({
                type: 'error',
                message: `Troppi errori: ${this.metrics.errorCount}`,
                metric: 'errors',
                value: this.metrics.errorCount
            });
        }

        return alerts;
    }

    showAlerts() {
        const alerts = this.checkAlerts();
        
        alerts.forEach(alert => {
            if (window.showToast) {
                window.showToast(alert.message, alert.type);
            } else {
                console.warn(`Performance Alert: ${alert.message}`);
            }
        });
    }

    // ===== AUTO OPTIMIZATION =====
    
    autoOptimize() {
        const alerts = this.checkAlerts();
        let optimizations = [];

        alerts.forEach(alert => {
            switch (alert.metric) {
                case 'fps':
                    // Riduce animazioni
                    document.querySelectorAll('[class*="animate"]').forEach(el => {
                        el.style.animationDuration = '0.1s';
                    });
                    optimizations.push('Ridotte animazioni per migliorare FPS');
                    break;

                case 'memory':
                    // Pulisce cache immagini
                    this.clearImageCache();
                    optimizations.push('Pulita cache immagini');
                    break;

                case 'lcp':
                    // Preload immagini critiche
                    this.preloadCriticalImages();
                    optimizations.push('Precaricate immagini critiche');
                    break;
            }
        });

        if (optimizations.length > 0 && window.showToast) {
            window.showToast(`Auto-ottimizzazioni applicate: ${optimizations.length}`, 'success');
        }

        return optimizations;
    }

    clearImageCache() {
        // Rimuove immagini non visibili dalla cache
        document.querySelectorAll('img').forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible && img.src.startsWith('blob:')) {
                URL.revokeObjectURL(img.src);
            }
        });
    }

    preloadCriticalImages() {
        // Precarica immagini above-the-fold
        document.querySelectorAll('img').forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight * 1.5) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = img.src;
                link.as = 'image';
                document.head.appendChild(link);
            }
        });
    }

    // ===== STATIC METHODS =====
    
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
}

// Inizializzazione automatica
document.addEventListener('DOMContentLoaded', () => {
    // Attendi che altri script si carichino
    setTimeout(() => {
        window.performanceMonitor = PerformanceMonitor.getInstance();
        
        // Mostra automaticamente su pagine di sviluppo
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('debug=true')) {
            window.performanceMonitor.show();
        }
    }, 1000);
});

// Comandi console per debugging
window.perfMonitor = {
    show: () => window.performanceMonitor?.show(),
    hide: () => window.performanceMonitor?.hide(),
    metrics: () => window.performanceMonitor?.getMetrics(),
    export: () => window.performanceMonitor?.exportMetrics(),
    alerts: () => window.performanceMonitor?.checkAlerts(),
    optimize: () => window.performanceMonitor?.autoOptimize()
};

// Esporta per uso globale
window.PerformanceMonitor = PerformanceMonitor;













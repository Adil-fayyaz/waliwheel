// ===== MODERN FEATURES =====

class ModernFeatures {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupDarkMode();
        this.setupPWA();
        this.setupNotifications();
        this.setupServiceWorker();
        this.setupOfflineSupport();
        this.setupPerformanceMonitoring();
    }

    // ===== DARK MODE =====
    setupDarkMode() {
        this.applyDarkMode();
        this.createThemeToggle();
    }

    applyDarkMode() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.style.background = 'linear-gradient(135deg, #0f172a, #1e293b)';
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.style.background = '';
        }
    }

    createThemeToggle() {
        const existingToggle = document.getElementById('themeToggle');
        if (existingToggle) {
            existingToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        } else {
            // Create theme toggle if it doesn't exist
            const toggle = document.createElement('button');
            toggle.id = 'themeToggle';
            toggle.className = 'theme-toggle';
            toggle.innerHTML = `
                <svg class="theme-icon" viewBox="0 0 24 24">
                    <path class="sun-path" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    <path class="moon-path" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
            `;
            toggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
            
            // Add to header if available
            const navActions = document.querySelector('.nav-actions');
            if (navActions) {
                navActions.appendChild(toggle);
            }
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyDarkMode();
        this.showToast(`Modalità ${this.isDarkMode ? 'scura' : 'chiara'} attivata`, 'info');
    }

    // ===== PWA FEATURES =====
    setupPWA() {
        this.createInstallPrompt();
        this.setupAppManifest();
    }

    createInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            this.showToast('App installata con successo!', 'success');
            this.hideInstallButton();
        });
    }

    showInstallButton(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn glass-button primary';
        installBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 18px; height: 18px; margin-right: 8px;">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Installa App
        `;
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    this.showToast('Installazione avviata...', 'info');
                }
                deferredPrompt = null;
                this.hideInstallButton();
            }
        });

        // Add to header
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(installBtn);
        }
    }

    hideInstallButton() {
        const installBtn = document.querySelector('.install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    setupAppManifest() {
        // Ensure manifest is properly linked
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (!existingManifest) {
            const manifest = document.createElement('link');
            manifest.rel = 'manifest';
            manifest.href = '/manifest.json';
            document.head.appendChild(manifest);
        }
    }

    // ===== NOTIFICATIONS =====
    setupNotifications() {
        this.requestNotificationPermission();
        this.setupNotificationHandlers();
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.showToast('Notifiche abilitate!', 'success');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    }

    setupNotificationHandlers() {
        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkPendingNotifications();
            }
        });

        // Listen for online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connessione ripristinata', 'Sei di nuovo online!');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Connessione persa', 'Verifica la tua connessione internet');
        });
    }

    showNotification(title, body, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon: '/image.png',
                badge: '/image.png',
                tag: 'wali-wheels',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto-close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);

            return notification;
        }
    }

    checkPendingNotifications() {
        // Check for pending notifications when page becomes visible
        const pending = localStorage.getItem('pendingNotifications');
        if (pending) {
            try {
                const notifications = JSON.parse(pending);
                notifications.forEach(notification => {
                    this.showNotification(notification.title, notification.body);
                });
                localStorage.removeItem('pendingNotifications');
            } catch (error) {
                console.error('Error processing pending notifications:', error);
            }
        }
    }

    // ===== SERVICE WORKER =====
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    this.setupServiceWorkerUpdates(registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    setupServiceWorkerUpdates(registration) {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateNotification();
                }
            });
        });
    }

    showUpdateNotification() {
        const updateBtn = document.createElement('button');
        updateBtn.className = 'update-btn glass-button primary';
        updateBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 18px; height: 18px; margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Aggiorna App
        `;
        
        updateBtn.addEventListener('click', () => {
            window.location.reload();
        });

        // Add to header
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(updateBtn);
        }

        this.showToast('Nuova versione disponibile!', 'info');
    }

    // ===== OFFLINE SUPPORT =====
    setupOfflineSupport() {
        this.createOfflineIndicator();
        this.setupOfflineHandlers();
    }

    createOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <div class="offline-content">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; margin-right: 8px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Modalità offline</span>
            </div>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 0.75rem;
            text-align: center;
            z-index: 10000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        `;

        document.body.appendChild(indicator);
        this.offlineIndicator = indicator;
    }

    setupOfflineHandlers() {
        window.addEventListener('online', () => {
            this.hideOfflineIndicator();
        });

        window.addEventListener('offline', () => {
            this.showOfflineIndicator();
        });

        // Check initial status
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }
    }

    showOfflineIndicator() {
        if (this.offlineIndicator) {
            this.offlineIndicator.style.transform = 'translateY(0)';
        }
    }

    hideOfflineIndicator() {
        if (this.offlineIndicator) {
            this.offlineIndicator.style.transform = 'translateY(-100%)';
        }
    }

    // ===== PERFORMANCE MONITORING =====
    setupPerformanceMonitoring() {
        this.monitorPerformance();
        this.setupLazyLoading();
        this.setupImageOptimization();
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                    }
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupImageOptimization() {
        // Add loading="lazy" to images that don't have it
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // ===== UTILITY METHODS =====
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
    window.modernFeatures = new ModernFeatures();
});

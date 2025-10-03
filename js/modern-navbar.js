// ===== MODERN NAVBAR JAVASCRIPT =====

class ModernNavbar {
    constructor() {
        this.header = document.querySelector('.header-glass');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.themeToggle = document.getElementById('themeToggle');
        this.authBtn = document.getElementById('authBtn');
        this.mobileAuthBtn = document.getElementById('mobileAuthBtn');
        this.profileMenu = document.getElementById('profileMenu');
        this.profileBtn = document.getElementById('profileBtn');
        
        this.lastScrollY = window.scrollY;
        this.isScrolling = false;
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupThemeToggle();
        this.setupAuthSystem();
        this.setupProfileMenu();
        this.setupActiveLinks();
        this.setupActionButtons();
        this.setupKeyboardNavigation();
        this.setupPerformanceOptimizations();
        
        // Inizializza stato
        this.updateHeaderState();
        this.updateActiveLink();
    }
    
    // ===== SCROLL BEHAVIOR =====
    setupScrollBehavior() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollState();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Gestione scroll veloce
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: true });
    }
    
    updateScrollState() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        const scrollThreshold = 100;
        
        // Aggiorna header state
        if (currentScrollY > scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Auto-hide header su scroll down (solo desktop)
        if (window.innerWidth > 768 && !this.isMobileMenuOpen) {
            if (scrollDirection === 'down' && currentScrollY > 200) {
                this.header.classList.add('hidden');
            } else if (scrollDirection === 'up' || currentScrollY < 50) {
                this.header.classList.remove('hidden');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleWheel(event) {
        // Mostra header su scroll up veloce
        if (event.deltaY < 0 && this.header.classList.contains('hidden')) {
            this.header.classList.remove('hidden');
        }
    }
    
    // ===== MOBILE MENU =====
    setupMobileMenu() {
        if (!this.mobileToggle || !this.mobileMenu) return;
        
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Chiudi menu su click esterno
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Chiudi menu su resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Gestione escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.mobileToggle.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animazione ingress
        this.animateMobileMenuIn();
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Animazione uscita
        this.animateMobileMenuOut();
    }
    
    animateMobileMenuIn() {
        const links = this.mobileMenu.querySelectorAll('.nav-link');
        links.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    animateMobileMenuOut() {
        const links = this.mobileMenu.querySelectorAll('.nav-link');
        links.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(-20px)';
            }, index * 30);
        });
    }
    
    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        if (!this.themeToggle) return;
        
        // Carica tema salvato
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Aggiorna icona
        const sunPath = this.themeToggle.querySelector('.sun-path');
        const moonPath = this.themeToggle.querySelector('.moon-path');
        
        if (theme === 'dark') {
            sunPath.style.opacity = '0';
            moonPath.style.opacity = '1';
        } else {
            sunPath.style.opacity = '1';
            moonPath.style.opacity = '0';
        }
    }
    
    // ===== AUTH SYSTEM =====
    setupAuthSystem() {
        if (!this.authBtn) return;
        
        // Simula stato autenticazione
        this.checkAuthState();
        
        this.authBtn.addEventListener('click', () => {
            this.handleAuthClick();
        });
        
        if (this.mobileAuthBtn) {
            this.mobileAuthBtn.addEventListener('click', () => {
                this.handleAuthClick();
                this.closeMobileMenu();
            });
        }
    }
    
    checkAuthState() {
        // Simula controllo stato utente
        const isAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
        
        if (isAuthenticated) {
            this.showProfileMenu();
        } else {
            this.showAuthButton();
        }
    }
    
    handleAuthClick() {
        // Simula apertura modal auth
        this.showAuthModal();
    }
    
    showAuthModal() {
        // Placeholder per modal auth
        console.log('Opening auth modal...');
        
        // Simula login dopo 2 secondi
        setTimeout(() => {
            localStorage.setItem('userAuthenticated', 'true');
            this.checkAuthState();
        }, 2000);
    }
    
    showAuthButton() {
        if (this.authContainer) {
            this.authContainer.style.display = 'flex';
        }
        if (this.profileMenu) {
            this.profileMenu.style.display = 'none';
        }
    }
    
    showProfileMenu() {
        if (this.authContainer) {
            this.authContainer.style.display = 'none';
        }
        if (this.profileMenu) {
            this.profileMenu.style.display = 'block';
        }
    }
    
    // ===== PROFILE MENU =====
    setupProfileMenu() {
        if (!this.profileBtn) return;
        
        this.profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleProfileDropdown();
        });
        
        // Chiudi dropdown su click esterno
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown && !this.profileMenu.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                // Animazione di entrata
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                
                requestAnimationFrame(() => {
                    dropdown.style.transition = 'all 0.3s ease';
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                });
            }
        }
    }
    
    // ===== ACTIVE LINKS =====
    setupActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Rimuovi active da tutti i link
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Aggiungi active al link cliccato
                link.classList.add('active');
                
                // Chiudi mobile menu se aperto
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    updateActiveLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.endsWith(href) || (href === 'index.html' && currentPath.endsWith('/'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ===== ACTION BUTTONS =====
    setupActionButtons() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.handleCartClick();
            });
        }
        
        // Notifications button
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.handleNotificationsClick();
            });
        }
        
        // Compare button
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.handleCompareClick();
            });
        }
        
        // Simula dati
        this.updateBadges();
    }
    
    handleCartClick() {
        console.log('Cart clicked');
        this.showNotification('Carrello aperto');
    }
    
    handleNotificationsClick() {
        console.log('Notifications clicked');
        this.showNotification('Notifiche aperte');
    }
    
    handleCompareClick() {
        console.log('Compare clicked');
        this.showNotification('Confronto auto aperto');
    }
    
    updateBadges() {
        // Simula aggiornamento badge
        const cartCount = document.getElementById('cartCount');
        const notificationsBadge = document.getElementById('notificationsBadge');
        const compareCount = document.getElementById('compareCount');
        
        if (cartCount) cartCount.textContent = Math.floor(Math.random() * 5);
        if (notificationsBadge) notificationsBadge.textContent = Math.floor(Math.random() * 3);
        if (compareCount) compareCount.textContent = Math.floor(Math.random() * 2);
    }
    
    // ===== KEYBOARD NAVIGATION =====
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigazione con Tab
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
            
            // Shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case '/':
                        e.preventDefault();
                        this.toggleMobileMenu();
                        break;
                }
            }
        });
    }
    
    handleTabNavigation(e) {
        const focusableElements = this.header.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    focusSearch() {
        // Placeholder per focus su search
        console.log('Focus search');
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        // Intersection Observer per lazy loading
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, { threshold: 0.1 });
            
            // Osserva elementi navbar
            const navElements = this.header.querySelectorAll('.nav-link, .nav-action-btn');
            navElements.forEach(el => observer.observe(el));
        }
        
        // Preload critico
        this.preloadCriticalResources();
    }
    
    preloadCriticalResources() {
        // Preload font
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    // ===== UTILITY METHODS =====
    updateHeaderState() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    showNotification(message) {
        // Crea notifica temporanea
        const notification = document.createElement('div');
        notification.className = 'nav-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 255, 136, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animazione entrata
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // ===== PUBLIC API =====
    refresh() {
        this.updateActiveLink();
        this.updateBadges();
        this.checkAuthState();
    }
    
    destroy() {
        // Cleanup event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleDocumentClick);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza navbar moderna
    window.modernNavbar = new ModernNavbar();
    
    // Esponi API globale
    window.navbarAPI = {
        refresh: () => window.modernNavbar.refresh(),
        toggleMobileMenu: () => window.modernNavbar.toggleMobileMenu(),
        showNotification: (msg) => window.modernNavbar.showNotification(msg)
    };
});

// ===== SERVICE WORKER INTEGRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

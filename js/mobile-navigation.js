/**
 * Advanced Mobile Navigation System
 * Handles responsive navigation, touch gestures, and mobile UX
 */

class MobileNavigation {
    constructor() {
        this.isMenuOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.navHeight = 0;
        
        this.init();
    }

    init() {
        this.createMobileNavigation();
        this.bindEvents();
        this.setupSwipeGestures();
        this.setupScrollBehavior();
        this.handleOrientationChange();
    }

    // ===== MOBILE NAVIGATION CREATION =====
    
    createMobileNavigation() {
        const nav = document.querySelector('.nav-container');
        if (!nav) return;
        
        // Add mobile toggle button
        if (!nav.querySelector('.nav-toggle')) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'nav-toggle';
            toggleButton.innerHTML = `
                <span class="hamburger">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </span>
            `;
            toggleButton.setAttribute('aria-label', 'Toggle navigation');
            toggleButton.setAttribute('aria-expanded', 'false');
            
            nav.appendChild(toggleButton);
        }
        
        // Enhance existing nav menu
        const navMenu = nav.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.add('mobile-nav-menu');
            
            // Add close button to mobile menu
            if (!navMenu.querySelector('.nav-close')) {
                const closeButton = document.createElement('button');
                closeButton.className = 'nav-close';
                closeButton.innerHTML = '×';
                closeButton.setAttribute('aria-label', 'Close navigation');
                navMenu.insertBefore(closeButton, navMenu.firstChild);
            }
            
            // Add overlay
            if (!document.querySelector('.nav-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'nav-overlay';
                document.body.appendChild(overlay);
            }
        }
        
        this.navHeight = nav.offsetHeight;
        this.addMobileStyles();
    }
    
    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .nav-toggle {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                z-index: 1001;
                position: relative;
            }
            
            .hamburger {
                display: flex;
                flex-direction: column;
                width: 24px;
                height: 18px;
                justify-content: space-between;
            }
            
            .hamburger-line {
                width: 100%;
                height: 2px;
                background: white;
                border-radius: 2px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                transform-origin: center;
            }
            
            .nav-toggle.active .hamburger-line:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .nav-toggle.active .hamburger-line:nth-child(2) {
                opacity: 0;
                transform: scaleX(0);
            }
            
            .nav-toggle.active .hamburger-line:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            .nav-close {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 32px;
                cursor: pointer;
                padding: 8px;
                align-self: flex-end;
                margin-bottom: 20px;
                width: 48px;
                height: 48px;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: background 0.3s ease;
            }
            
            .nav-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 999;
                backdrop-filter: blur(4px);
            }
            
            .nav-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            @media (max-width: 768px) {
                .nav-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .mobile-nav-menu {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 85%;
                    max-width: 320px;
                    height: 100vh;
                    background: rgba(15, 23, 42, 0.98);
                    backdrop-filter: blur(20px);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    flex-direction: column !important;
                    padding: 20px;
                    gap: 0 !important;
                    transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1000;
                    overflow-y: auto;
                    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
                }
                
                .mobile-nav-menu.active {
                    left: 0;
                }
                
                .mobile-nav-menu .nav-close {
                    display: flex;
                }
                
                .mobile-nav-menu .nav-link {
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 18px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .mobile-nav-menu .nav-link::before {
                    content: '';
                    position: absolute;
                    left: -100%;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(135deg, #00ff88, #22d3ee);
                    transition: left 0.3s ease;
                }
                
                .mobile-nav-menu .nav-link:hover::before,
                .mobile-nav-menu .nav-link.active::before {
                    left: 0;
                }
                
                .mobile-nav-menu .nav-link:hover {
                    color: #00ff88;
                    padding-left: 16px;
                }
                
                .mobile-nav-menu .nav-link:last-child {
                    border-bottom: none;
                }
                
                .nav-actions {
                    margin-top: auto;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .nav-actions .glass-button {
                    width: 100%;
                    justify-content: center;
                    margin-bottom: 12px;
                }
            }
            
            @media (min-width: 769px) {
                .nav-overlay {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== EVENT BINDING =====
    
    bindEvents() {
        const toggleButton = document.querySelector('.nav-toggle');
        const closeButton = document.querySelector('.nav-close');
        const overlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    // ===== MENU CONTROL =====
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        const navMenu = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.nav-overlay');
        const toggleButton = document.querySelector('.nav-toggle');
        
        if (navMenu) {
            navMenu.classList.add('active');
        }
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        if (toggleButton) {
            toggleButton.classList.add('active');
            toggleButton.setAttribute('aria-expanded', 'true');
        }
        
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
        
        // Focus management
        const firstLink = navMenu?.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
        
        // Animate menu items
        this.animateMenuItems();
    }
    
    closeMenu() {
        const navMenu = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.nav-overlay');
        const toggleButton = document.querySelector('.nav-toggle');
        
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        if (toggleButton) {
            toggleButton.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
        
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }
    
    animateMenuItems() {
        const navLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
        
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }

    // ===== SWIPE GESTURES =====
    
    setupSwipeGestures() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
            if (deltaX > 0 && this.touchStartX < 50) {
                // Swipe right from left edge - open menu
                this.openMenu();
            } else if (deltaX < 0 && this.isMenuOpen) {
                // Swipe left - close menu
                this.closeMenu();
            }
        }
    }

    // ===== SCROLL BEHAVIOR =====
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header-glass');
        
        if (!header) return;
        
        // Hide/show header on scroll
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.navHeight) {
            // Scrolling down
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up
            header.classList.remove('nav-hidden');
        }
        
        // Add scrolled class for styling
        if (currentScrollTop > 50) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }
        
        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    // ===== ORIENTATION HANDLING =====
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
                
                // Recalculate nav height
                const nav = document.querySelector('.nav-container');
                if (nav) {
                    this.navHeight = nav.offsetHeight;
                }
            }, 100);
        });
    }

    // ===== UTILITY METHODS =====
    
    addScrollStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .header-glass {
                transition: transform 0.3s ease, background-color 0.3s ease;
            }
            
            .header-glass.nav-hidden {
                transform: translateY(-100%);
            }
            
            .header-glass.nav-scrolled {
                background: rgba(42, 42, 42, 0.95);
                backdrop-filter: blur(20px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            @media (max-width: 768px) {
                .header-glass.nav-hidden {
                    transform: translateY(-100%);
                }
                
                .header-glass.nav-scrolled {
                    background: rgba(15, 23, 42, 0.98);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public API methods
    isOpen() {
        return this.isMenuOpen;
    }
    
    open() {
        this.openMenu();
    }
    
    close() {
        this.closeMenu();
    }
    
    toggle() {
        this.toggleMenu();
    }
}

// Initialize mobile navigation
let mobileNavigation;

document.addEventListener('DOMContentLoaded', () => {
    mobileNavigation = new MobileNavigation();
    window.mobileNavigation = mobileNavigation;
    
    console.log('📱 Mobile Navigation initialized successfully!');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}

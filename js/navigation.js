/* ===== NAVIGAZIONE INTERATTIVA ===== */

class NavigationManager {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupActiveStates();
        this.addInteractiveEffects();
        this.setupMobileMenu();
    }

    setupNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const href = link.getAttribute('href');
                const targetPage = href;
                
                // Effetto di click con ripple
                this.createRippleEffect(e);
                
                // Animazione di transizione
                this.animatePageTransition(() => {
                    window.location.href = targetPage;
                });
            });

            // Effetti hover avanzati
            link.addEventListener('mouseenter', () => {
                this.addHoverEffects(link);
            });

            link.addEventListener('mouseleave', () => {
                this.removeHoverEffects(link);
            });
        });
    }

    setupActiveStates() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPage || 
                (this.currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    addInteractiveEffects() {
        this.navLinks.forEach(link => {
            // Aggiungi classe per effetti 3D
            link.classList.add('nav-link-3d');
            
            // Effetto magnetico
            link.addEventListener('mousemove', (e) => {
                this.magneticEffect(link, e);
            });
        });
    }

    createRippleEffect(e) {
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 209, 178, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;

        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    magneticEffect(element, e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    addHoverEffects(link) {
        link.style.transform = 'translateY(-3px) scale(1.05)';
        link.style.boxShadow = '0 8px 25px rgba(0, 209, 178, 0.4)';
        
        // Effetto glow
        link.style.textShadow = '0 0 20px rgba(0, 209, 178, 0.8)';
        
        // Particelle fluttuanti
        this.createFloatingParticles(link);
    }

    removeHoverEffects(link) {
        link.style.transform = 'translateY(0) scale(1)';
        link.style.boxShadow = 'none';
        link.style.textShadow = 'none';
        
        // Rimuovi particelle
        const particles = link.querySelectorAll('.floating-particle');
        particles.forEach(particle => particle.remove());
    }

    createFloatingParticles(link) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                animation: float-particle 2s ease-in-out infinite;
                animation-delay: ${i * 0.2}s;
                z-index: 999;
            `;
            
            link.appendChild(particle);
        }
    }

    animatePageTransition(callback) {
        // Overlay di transizione
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--color-primary), var(--color-accent));
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Fade out e callback
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                callback();
            }, 300);
        }, 300);
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active');
            });
        }
    }
}

// Inizializza la navigazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Esporta per uso esterno
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}

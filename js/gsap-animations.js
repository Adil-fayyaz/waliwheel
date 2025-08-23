// AutoShop Premium - Animazioni GSAP Avanzate

class GSAPAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Registra ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Inizializza tutte le animazioni
        this.initHeroAnimations();
        this.initScrollReveal();
        this.initParallaxEffects();
        this.initCounterAnimations();
        this.initStaggerAnimations();
        this.initHoverAnimations();
        this.initPageTransitions();
        
        // Refresh ScrollTrigger quando le immagini sono caricate
        this.setupImageLoadRefresh();
    }
    
    initHeroAnimations() {
        // Timeline per l'hero section
        const heroTimeline = gsap.timeline();
        
        // Animazione del titolo principale
        heroTimeline.from('.hero-title .title-line', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.hero-title .title-accent', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.6')
        .from('.hero-cta-group', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.hero-car-showcase', {
            duration: 1.5,
            scale: 0.8,
            rotationY: 45,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.8');
        
        // Animazione continua per l'auto 3D
        gsap.to('.car-model', {
            rotationY: 360,
            duration: 20,
            repeat: -1,
            ease: 'none'
        });
        
        // Animazione per le luci dell'auto
        gsap.to('.car-lights::before, .car-lights::after', {
            opacity: 0.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
        
        // Animazione per l'indicatore di scroll
        gsap.to('.hero-scroll-indicator', {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }
    
    initScrollReveal() {
        // Animazioni per le sezioni principali
        gsap.utils.toArray('.section-header').forEach(section => {
            gsap.fromTo(section, {
                y: 60,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Animazioni per le card auto
        gsap.utils.toArray('.car-card').forEach((card, index) => {
            gsap.fromTo(card, {
                y: 80,
                opacity: 0,
                rotationY: 15,
                scale: 0.9
            }, {
                y: 0,
                opacity: 1,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Animazioni per le pillole categoria
        gsap.utils.toArray('.glass-pill').forEach((pill, index) => {
            gsap.fromTo(pill, {
                y: 40,
                opacity: 0,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: pill,
                    start: 'top 90%',
                    end: 'bottom 10%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Animazioni per i brand logo
        gsap.utils.toArray('.brand-logo').forEach((logo, index) => {
            gsap.fromTo(logo, {
                y: 50,
                opacity: 0,
                rotationY: 30
            }, {
                y: 0,
                opacity: 1,
                rotationY: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: logo,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Animazioni per il footer
        gsap.fromTo('.footer-content', {
            y: 60,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer-glass',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
                }
        });
    }
    
    initParallaxEffects() {
        // Parallax per gli elementi di sfondo
        gsap.utils.toArray('.parallax-layer').forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            
            gsap.to(layer, {
                yPercent: -100 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: layer.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
        
        // Parallax per le immagini delle card
        gsap.utils.toArray('.car-image').forEach(image => {
            gsap.to(image, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: image.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
        
        // Parallax per il banner test drive
        gsap.to('.banner-test-drive', {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner-test-drive',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    initCounterAnimations() {
        // Animazione contatori numerici
        gsap.utils.toArray('[data-counter]').forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseFloat(counter.dataset.duration) || 2;
            
            gsap.fromTo(counter, {
                innerText: 0
            }, {
                innerText: target,
                duration: duration,
                ease: 'power2.out',
                roundProps: 'innerText',
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
    
    initStaggerAnimations() {
        // Animazioni stagger per griglie
        gsap.utils.toArray('.cars-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.car-card');
            
            gsap.fromTo(cards, {
                y: 100,
                opacity: 0,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Animazioni stagger per le pillole categoria
        gsap.fromTo('.category-pills .glass-pill', {
            y: 50,
            opacity: 0,
            scale: 0.8
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.category-pills',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    initHoverAnimations() {
        // Animazioni hover per le card auto
        gsap.utils.toArray('.car-card').forEach(card => {
            const image = card.querySelector('.car-image');
            const content = card.querySelector('.car-content');
            
            // Hover enter
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                gsap.to(content, {
                    y: -10,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                gsap.to(card, {
                    boxShadow: '0 20px 40px rgba(0, 209, 178, 0.3)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            
            // Hover leave
            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                gsap.to(content, {
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                gsap.to(card, {
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });
        
        // Animazioni hover per i bottoni
        gsap.utils.toArray('.btn-primary-glass, .btn-cta-glass').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    initPageTransitions() {
        // Animazioni per i link di navigazione
        gsap.utils.toArray('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    // Animazione di uscita
                    gsap.to('body', {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            window.location.href = link.getAttribute('href');
                        }
                    });
                }
            });
        });
    }
    
    setupImageLoadRefresh() {
        // Refresh ScrollTrigger quando le immagini sono caricate
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        ScrollTrigger.refresh();
                    }
                });
            }
        });
        
        // Fallback per immagini già caricate
        if (loadedImages === images.length) {
            ScrollTrigger.refresh();
        }
    }
    
    // Metodi pubblici per controllare le animazioni
    playHeroAnimation() {
        this.initHeroAnimations();
    }
    
    refreshAnimations() {
        ScrollTrigger.refresh();
    }
    
    pauseAnimations() {
        gsap.globalTimeline.pause();
    }
    
    resumeAnimations() {
        gsap.globalTimeline.resume();
    }
    
    // Animazioni personalizzate per elementi specifici
    animateElement(element, animation) {
        const animations = {
            fadeIn: {
                from: { opacity: 0, y: 30 },
                to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            },
            slideIn: {
                from: { x: -100, opacity: 0 },
                to: { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            },
            scaleIn: {
                from: { scale: 0, opacity: 0 },
                to: { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
            },
            bounceIn: {
                from: { scale: 0, opacity: 0 },
                to: { scale: 1, opacity: 1, duration: 0.8, ease: 'bounce.out' }
            }
        };
        
        const anim = animations[animation];
        if (anim) {
            gsap.fromTo(element, anim.from, anim.to);
        }
    }
    
    // Animazione per il caricamento delle auto
    animateCarCards(cards, container) {
        if (!container) return;
        
        // Nascondi le card esistenti
        gsap.set(cards, { opacity: 0, y: 50 });
        
        // Mostra le nuove card con animazione stagger
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
    
    // Animazione per i filtri categoria
    animateCategoryFilter(activePill) {
        // Rimuovi animazione da tutte le pillole
        gsap.set('.glass-pill', { scale: 1, backgroundColor: 'var(--color-surface)' });
        
        // Anima la pillola attiva
        gsap.to(activePill, {
            scale: 1.1,
            backgroundColor: 'var(--color-primary)',
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// Inizializza le animazioni GSAP
window.initGSAPAnimations = function() {
    if (typeof gsap !== 'undefined') {
        window.gsapAnimations = new GSAPAnimations();
        console.log('🎬 Animazioni GSAP inizializzate');
    } else {
        console.warn('⚠️ GSAP non disponibile, animazioni disabilitate');
    }
};

// Utility functions per animazioni
window.gsapUtils = {
    // Fade in semplice
    fadeIn: (element, duration = 0.6) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration, ease: 'power2.out' }
        );
    },
    
    // Slide in da sinistra
    slideInLeft: (element, duration = 0.6) => {
        gsap.fromTo(element,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration, ease: 'power2.out' }
        );
    },
    
    // Slide in da destra
    slideInRight: (element, duration = 0.6) => {
        gsap.fromTo(element,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration, ease: 'power2.out' }
        );
    },
    
    // Scale in con bounce
    scaleIn: (element, duration = 0.6) => {
        gsap.fromTo(element,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' }
        );
    },
    
    // Hover effect per card
    cardHover: (card, isHovering) => {
        const image = card.querySelector('.car-image');
        const content = card.querySelector('.car-content');
        
        if (isHovering) {
            gsap.to(image, { scale: 1.1, duration: 0.3 });
            gsap.to(content, { y: -5, duration: 0.3 });
        } else {
            gsap.to(image, { scale: 1, duration: 0.3 });
            gsap.to(content, { y: 0, duration: 0.3 });
        }
    }
};

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Piccolo delay per assicurarsi che GSAP sia caricato
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            window.initGSAPAnimations();
        }
    }, 100);
});

/* ===== ANIMAZIONI GSAP AVANZATE E EFFETTI 3D ===== */

class AdvancedAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Inizializza GSAP
        this.setupGSAP();
        
        // Inizializza effetti 3D
        this.setup3DEffects();
        
        // Inizializza animazioni scroll
        this.setupScrollAnimations();
        
        // Inizializza effetti particelle
        this.setupParticleEffects();
        
        // Inizializza effetti mouse
        this.setupMouseEffects();
        
        // Inizializza effetti parallax
        this.setupParallaxEffects();
        
        // Inizializza effetti morphing
        this.setupMorphingEffects();
        
        // Inizializza effetti interattivi
        this.setupInteractiveEffects();
    }

    setupGSAP() {
        // Registra plugin GSAP
        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
        
        // Timeline principale
        this.mainTimeline = gsap.timeline();
        
        // Animazione di entrata della pagina
        this.pageEntranceAnimation();
        
        // Animazioni degli elementi hero
        this.heroAnimations();
        
        // Animazioni delle card auto
        this.carCardAnimations();
        
        // Animazioni dei pulsanti
        this.buttonAnimations();
    }

    pageEntranceAnimation() {
        // Animazione di entrata della pagina
        gsap.fromTo('body', 
            { opacity: 0, scale: 0.95 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 1.5, 
                ease: "power3.out" 
            }
        );

        // Animazione header
        gsap.fromTo('.header-glass', 
            { y: -100, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "back.out(1.7)" 
            }
        );

        // Animazione logo
        gsap.fromTo('.logo-glow', 
            { scale: 0, rotation: -180 },
            { 
                scale: 1, 
                rotation: 0, 
                duration: 1.2, 
                ease: "elastic.out(1, 0.3)",
                delay: 0.3
            }
        );

        // Animazione menu navigazione
        gsap.fromTo('.nav-link', 
            { y: -50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                stagger: 0.1,
                delay: 0.5
            }
        );
    }

    heroAnimations() {
        // Animazione titolo hero
        gsap.fromTo('.hero-title', 
            { 
                y: 100, 
                opacity: 0, 
                scale: 0.8,
                rotationX: 90
            },
            { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                rotationX: 0,
                duration: 1.5, 
                ease: "power3.out",
                delay: 0.8
            }
        );

        // Animazione sottotitolo
        gsap.fromTo('.hero-subtitle', 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                delay: 1.2
            }
        );

        // Animazione pulsanti CTA
        gsap.fromTo('.hero-cta-group .glass-button', 
            { 
                y: 100, 
                opacity: 0, 
                scale: 0.5,
                rotationY: 90
            },
            { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                rotationY: 0,
                duration: 1, 
                ease: "back.out(1.7)",
                stagger: 0.2,
                delay: 1.5
            }
        );

        // Animazione background hero
        gsap.fromTo('.hero-section::before', 
            { scale: 0.8, opacity: 0 },
            { 
                scale: 1, 
                opacity: 1, 
                duration: 2, 
                ease: "power2.out",
                delay: 0.5
            }
        );
    }

    carCardAnimations() {
        // Animazione delle card auto con scroll trigger
        gsap.utils.toArray('.car-card').forEach((card, index) => {
            gsap.fromTo(card, 
                { 
                    y: 100, 
                    opacity: 0, 
                    scale: 0.8,
                    rotationY: 45
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    rotationY: 0,
                    duration: 1, 
                    ease: "power3.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animazione hover delle card
        this.setupCardHoverEffects();
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.car-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    rotationY: 5,
                    rotationX: 5,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(card.querySelector('.car-image'), {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(card.querySelector('.car-image'), {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    buttonAnimations() {
        // Animazione pulsanti con effetti 3D
        const buttons = document.querySelectorAll('.glass-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                
                gsap.to(button, {
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.4)",
                    duration: 0.3
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(button, {
                    boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
                    duration: 0.3
                });
            });
            
            button.addEventListener('click', () => {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.in"
                });
                
                gsap.to(button, {
                    scale: 1,
                    duration: 0.1,
                    ease: "power2.out",
                    delay: 0.1
                });
            });
        });
    }

    setup3DEffects() {
        // Effetto 3D per il mouse movement
        this.setupMouse3DEffect();
        
        // Effetto 3D per le card
        this.setupCard3DEffect();
        
        // Effetto 3D per i pulsanti
        this.setupButton3DEffect();
    }

    setupMouse3DEffect() {
        const cards = document.querySelectorAll('.car-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }

    setupCard3DEffect() {
        // Effetto 3D per le card con scroll
        gsap.utils.toArray('.car-card').forEach(card => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                onEnter: () => {
                    gsap.to(card, {
                        z: 50,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                },
                onLeave: () => {
                    gsap.to(card, {
                        z: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    setupButton3DEffect() {
        const buttons = document.querySelectorAll('.glass-button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                gsap.to(button, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupScrollAnimations() {
        // Animazioni scroll per sezioni
        this.setupSectionScrollAnimations();
        
        // Animazioni scroll per elementi
        this.setupElementScrollAnimations();
        
        // Effetti parallax
        this.setupParallaxScroll();
    }

    setupSectionScrollAnimations() {
        // Animazione sezione hero
        ScrollTrigger.create({
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to('.hero-content', {
                    y: progress * 100,
                    rotationY: progress * 10,
                    duration: 0.1
                });
            }
        });

        // Animazione sezione catalogo
        gsap.fromTo('.catalog-section', 
            { opacity: 0, y: 100 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.catalog-section',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    setupElementScrollAnimations() {
        // Animazione elementi con classe scroll-reveal
        gsap.utils.toArray('.scroll-reveal').forEach(element => {
            gsap.fromTo(element, 
                { 
                    opacity: 0, 
                    y: 50,
                    scale: 0.8
                },
                { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    duration: 0.8, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animazione elementi con classe gsap-animate
        gsap.utils.toArray('.gsap-animate').forEach(element => {
            const animationType = this.getAnimationType(element);
            this.animateElement(element, animationType);
        });
    }

    getAnimationType(element) {
        if (element.classList.contains('from-left')) return 'from-left';
        if (element.classList.contains('from-right')) return 'from-right';
        if (element.classList.contains('from-bottom')) return 'from-bottom';
        if (element.classList.contains('scale-in')) return 'scale-in';
        if (element.classList.contains('rotate-in')) return 'rotate-in';
        return 'default';
    }

    animateElement(element, type) {
        const animations = {
            'from-left': { x: -100, opacity: 0 },
            'from-right': { x: 100, opacity: 0 },
            'from-bottom': { y: 100, opacity: 0 },
            'scale-in': { scale: 0.5, opacity: 0 },
            'rotate-in': { rotationY: 90, opacity: 0 },
            'default': { y: 50, opacity: 0 }
        };

        const startProps = animations[type];
        const endProps = { x: 0, y: 0, scale: 1, rotationY: 0, opacity: 1 };

        gsap.fromTo(element, 
            startProps,
            { 
                ...endProps,
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    setupParallaxScroll() {
        // Effetto parallax per background
        gsap.utils.toArray('.parallax-bg').forEach(element => {
            gsap.to(element, {
                y: (i, target) => -target.offsetHeight * 0.5,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Effetto parallax per elementi mid
        gsap.utils.toArray('.parallax-mid').forEach(element => {
            gsap.to(element, {
                y: (i, target) => -target.offsetHeight * 0.3,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    setupParticleEffects() {
        // Crea particelle fluttuanti
        this.createParticles();
        
        // Animazione particelle
        this.animateParticles();
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    animateParticles() {
        gsap.to('.particle', {
            y: -100,
            rotation: 360,
            duration: 6,
            ease: "none",
            repeat: -1,
            stagger: {
                each: 0.1,
                from: "random"
            }
        });
    }

    setupMouseEffects() {
        // Effetto mouse follower
        this.setupMouseFollower();
        
        // Effetto mouse trail
        this.setupMouseTrail();
    }

    setupMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(99,102,241,0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            gsap.to(follower, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.1,
                ease: "power2.out"
            });
        });
    }

    setupMouseTrail() {
        const trail = [];
        const trailLength = 10;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(99,102,241,0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        document.addEventListener('mousemove', (e) => {
            trail.forEach((dot, index) => {
                gsap.to(dot, {
                    x: e.clientX - 2,
                    y: e.clientY - 2,
                    duration: 0.1 + index * 0.02,
                    ease: "power2.out"
                });
            });
        });
    }

    setupParallaxEffects() {
        // Effetto parallax per immagini
        gsap.utils.toArray('.car-image').forEach(image => {
            gsap.to(image, {
                y: (i, target) => -target.offsetHeight * 0.2,
                ease: "none",
                scrollTrigger: {
                    trigger: image,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    setupMorphingEffects() {
        // Effetto morphing per forme
        gsap.utils.toArray('.morph-shape').forEach(shape => {
            gsap.to(shape, {
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                scale: 1.1,
                duration: 4,
                ease: "power2.inOut",
                repeat: -1,
                yoyo: true
            });
        });
    }

    setupInteractiveEffects() {
        // Effetti interattivi per elementi
        this.setupInteractiveElements();
        
        // Effetti hover avanzati
        this.setupAdvancedHoverEffects();
    }

    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll('.interactive-3d');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    scale: 1.1,
                    rotationY: 10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    scale: 1,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupAdvancedHoverEffects() {
        const hoverElements = document.querySelectorAll('.hover-3d, .hover-lift');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    // Metodi pubblici per animazioni personalizzate
    animateIn(element, animationType = 'default') {
        this.animateElement(element, animationType);
    }

    animateOut(element) {
        gsap.to(element, {
            opacity: 0,
            y: -50,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in"
        });
    }

    createStaggerAnimation(elements, stagger = 0.1) {
        gsap.fromTo(elements, 
            { opacity: 0, y: 50, scale: 0.8 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: stagger
            }
        );
    }
}

// Inizializza le animazioni quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    window.advancedAnimations = new AdvancedAnimations();
});

// Esporta la classe per uso esterno
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnimations;
}

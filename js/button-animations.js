/* ===== ANIMAZIONI AVANZATE PULSANTI ===== */

class ButtonAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupButtonEffects();
        this.setupHoverAnimations();
        this.setupClickEffects();
        this.setupScrollAnimations();
    }

    setupButtonEffects() {
        // Effetto magnetico per i pulsanti
        document.addEventListener('mousemove', (e) => {
            const buttons = document.querySelectorAll('.btn-fill-in, .btn-pulse, .btn-press, .btn-ripple, .btn-raise, .btn-glow, .btn-slide, .btn-bounce, .btn-shimmer');
            
            buttons.forEach(button => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
                
                if (distance < maxDistance) {
                    const intensity = 1 - (distance / maxDistance);
                    button.style.transform = `translate(${x * intensity * 0.1}px, ${y * intensity * 0.1}px)`;
                } else {
                    button.style.transform = 'translate(0, 0)';
                }
            });
        });

        // Reset transform quando il mouse esce
        document.addEventListener('mouseleave', () => {
            const buttons = document.querySelectorAll('.btn-fill-in, .btn-pulse, .btn-press, .btn-ripple, .btn-raise, .btn-glow, .btn-slide, .btn-bounce, .btn-shimmer');
            buttons.forEach(button => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupHoverAnimations() {
        // Effetto di espansione al hover
        const buttons = document.querySelectorAll('.btn-fill-in, .btn-pulse, .btn-press, .btn-ripple, .btn-raise, .btn-glow, .btn-slide, .btn-bounce, .btn-shimmer');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addHoverEffect(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.removeHoverEffect(button);
            });
        });
    }

    addHoverEffect(button) {
        // Aggiunge particelle fluttuanti
        const particles = this.createParticles(button);
        button.appendChild(particles);
        
        // Effetto di risonanza
        button.style.animation = 'buttonResonance 0.6s ease-out';
        
        // Aggiunge glow dinamico
        this.addDynamicGlow(button);
    }

    removeHoverEffect(button) {
        // Rimuove le particelle
        const particles = button.querySelector('.button-particles');
        if (particles) {
            particles.remove();
        }
        
        // Reset animazioni
        button.style.animation = '';
        button.style.boxShadow = '';
    }

    createParticles(button) {
        const particles = document.createElement('div');
        particles.className = 'button-particles';
        particles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;

        // Crea 6 particelle
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                animation: particleFloat 2s ease-out infinite;
                animation-delay: ${i * 0.2}s;
            `;
            
            // Posiziona le particelle in modo casuale
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            particles.appendChild(particle);
        }

        return particles;
    }

    addDynamicGlow(button) {
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
        let colorIndex = 0;
        
        const glowInterval = setInterval(() => {
            const color = colors[colorIndex];
            button.style.boxShadow = `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`;
            colorIndex = (colorIndex + 1) % colors.length;
        }, 200);

        // Salva l'interval per rimuoverlo
        button.dataset.glowInterval = glowInterval;
    }

    setupClickEffects() {
        const buttons = document.querySelectorAll('.btn-fill-in, .btn-pulse, .btn-press, .btn-ripple, .btn-raise, .btn-glow, .btn-slide, .btn-bounce, .btn-shimmer');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createClickRipple(e, button);
                this.addClickAnimation(button);
            });
        });
    }

    createClickRipple(e, button) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleExpand 0.6s ease-out;
            pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addClickAnimation(button) {
        // Effetto di compressione
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Effetto di vibrazione
        button.style.animation = 'buttonShake 0.3s ease-in-out';
        
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    setupScrollAnimations() {
        // Animazione dei pulsanti quando entrano nel viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateButtonIn(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const buttons = document.querySelectorAll('.btn-fill-in, .btn-pulse, .btn-press, .btn-ripple, .btn-raise, .btn-glow, .btn-slide, .btn-bounce, .btn-shimmer');
        buttons.forEach(button => observer.observe(button));
    }

    animateButtonIn(button) {
        button.style.opacity = '0';
        button.style.transform = 'translateY(30px) scale(0.8)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
}

// Aggiungi CSS per le animazioni
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }

    @keyframes buttonResonance {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    @keyframes rippleExpand {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }

    @keyframes buttonShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }

    .btn-fill-in,
    .btn-pulse,
    .btn-press,
    .btn-ripple,
    .btn-raise,
    .btn-glow,
    .btn-slide,
    .btn-bounce,
    .btn-shimmer {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, box-shadow;
    }

    .btn-fill-in:hover,
    .btn-pulse:hover,
    .btn-press:hover,
    .btn-ripple:hover,
    .btn-raise:hover,
    .btn-glow:hover,
    .btn-slide:hover,
    .btn-bounce:hover,
    .btn-shimmer:hover {
        transform: translateY(-3px) scale(1.02);
    }

    .btn-fill-in:active,
    .btn-pulse:active,
    .btn-press:active,
    .btn-ripple:active,
    .btn-raise:active,
    .btn-glow:active,
    .btn-slide:active,
    .btn-bounce:active,
    .btn-shimmer:active {
        transform: translateY(1px) scale(0.98);
    }
`;

document.head.appendChild(style);

// Inizializza le animazioni quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    new ButtonAnimations();
});

// Esporta per uso globale
window.ButtonAnimations = ButtonAnimations;

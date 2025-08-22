// AutoShop Premium - Effetti Tilt 3D per Card Auto

class TiltEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            max: options.max || 15,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.05,
            speed: options.speed || 500,
            reverse: options.reverse || false,
            ...options
        };
        
        this.bounds = null;
        this.rotateX = 0;
        this.rotateY = 0;
        this.requestId = null;
        
        this.init();
    }
    
    init() {
        this.element.style.transform = `perspective(${this.options.perspective}px)`;
        this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
        
        this.bounds = this.element.getBoundingClientRect();
        
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Supporto touch per dispositivi mobili
        this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.element.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
    
    onMouseEnter() {
        this.element.style.transition = 'none';
        this.element.style.transform = `perspective(${this.options.perspective}px) scale(${this.options.scale})`;
    }
    
    onMouseLeave() {
        this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
        this.element.style.transform = `perspective(${this.options.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        
        this.rotateX = 0;
        this.rotateY = 0;
    }
    
    onMouseMove(event) {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
        
        this.requestId = requestAnimationFrame(() => {
            this.updateTilt(event);
        });
    }
    
    onTouchStart(event) {
        this.element.style.transition = 'none';
        this.element.style.transform = `perspective(${this.options.perspective}px) scale(${this.options.scale})`;
    }
    
    onTouchMove(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = this.element.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            this.updateTiltFromCoordinates(x, y, rect.width, rect.height);
        }
    }
    
    onTouchEnd() {
        this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
        this.element.style.transform = `perspective(${this.options.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        
        this.rotateX = 0;
        this.rotateY = 0;
    }
    
    updateTilt(event) {
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.updateTiltFromCoordinates(x, y, rect.width, rect.height);
    }
    
    updateTiltFromCoordinates(x, y, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        const rotateXValue = this.options.reverse ? 
            ((y - centerY) / centerY) * this.options.max :
            ((centerY - y) / centerY) * this.options.max;
            
        const rotateYValue = this.options.reverse ?
            ((centerX - x) / centerX) * this.options.max :
            ((x - centerX) / centerX) * this.options.max;
        
        this.rotateX = rotateXValue;
        this.rotateY = rotateYValue;
        
        this.element.style.transform = `
            perspective(${this.options.perspective}px) 
            rotateX(${this.rotateX}deg) 
            rotateY(${this.rotateY}deg) 
            scale(${this.options.scale})
        `;
    }
    
    destroy() {
        this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.element.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.removeEventListener('touchstart', this.onTouchStart.bind(this));
        this.element.removeEventListener('touchmove', this.onTouchMove.bind(this));
        this.element.removeEventListener('touchend', this.onTouchEnd.bind(this));
        
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
        
        this.element.style.transform = '';
        this.element.style.transition = '';
    }
}

// Funzione globale per applicare effetti tilt
window.applyTiltEffect = function(element, options = {}) {
    if (element.classList.contains('tilt-initialized')) {
        return;
    }
    
    element.classList.add('tilt-initialized');
    
    // Opzioni personalizzate per diversi tipi di elementi
    let tiltOptions = {
        max: 15,
        perspective: 1000,
        scale: 1.02,
        speed: 500,
        reverse: false
    };
    
    // Opzioni specifiche per card auto
    if (element.classList.contains('car-card')) {
        tiltOptions = {
            max: 12,
            perspective: 1200,
            scale: 1.03,
            speed: 400,
            reverse: false
        };
    }
    
    // Opzioni specifiche per brand logo
    if (element.classList.contains('brand-logo')) {
        tiltOptions = {
            max: 8,
            perspective: 800,
            scale: 1.05,
            speed: 300,
            reverse: false
        };
    }
    
    // Opzioni specifiche per glass pills
    if (element.classList.contains('glass-pill')) {
        tiltOptions = {
            max: 6,
            perspective: 600,
            scale: 1.02,
            speed: 200,
            reverse: false
        };
    }
    
    // Applica opzioni personalizzate
    Object.assign(tiltOptions, options);
    
    // Crea e memorizza l'istanza dell'effetto tilt
    if (!element.tiltEffect) {
        element.tiltEffect = new TiltEffect(element, tiltOptions);
    }
    
    return element.tiltEffect;
};

// Funzione globale per inizializzare tutti gli effetti tilt
window.initTiltEffects = function() {
    // Applica tilt alle card auto
    document.querySelectorAll('.car-card:not(.tilt-initialized)').forEach(card => {
        window.applyTiltEffect(card);
    });
    
    // Applica tilt ai brand logo
    document.querySelectorAll('.brand-logo:not(.tilt-initialized)').forEach(logo => {
        window.applyTiltEffect(logo);
    });
    
    // Applica tilt alle glass pills
    document.querySelectorAll('.glass-pill:not(.tilt-initialized)').forEach(pill => {
        window.applyTiltEffect(pill);
    });
    
    // Applica tilt ai bottoni glass
    document.querySelectorAll('.btn-cta-glass:not(.tilt-initialized), .btn-primary-glass:not(.tilt-initialized)').forEach(btn => {
        window.applyTiltEffect(btn, {
            max: 5,
            perspective: 500,
            scale: 1.02,
            speed: 200
        });
    });
};

// Funzione per rimuovere tutti gli effetti tilt
window.destroyTiltEffects = function() {
    document.querySelectorAll('[class*="tilt-initialized"]').forEach(element => {
        if (element.tiltEffect) {
            element.tiltEffect.destroy();
            delete element.tiltEffect;
        }
        element.classList.remove('tilt-initialized');
    });
};

// Effetti tilt avanzati per elementi specifici
class AdvancedTiltEffect extends TiltEffect {
    constructor(element, options = {}) {
        super(element, options);
        
        this.glowIntensity = options.glowIntensity || 0.3;
        this.shadowIntensity = options.shadowIntensity || 0.5;
        this.originalBoxShadow = window.getComputedStyle(element).boxShadow;
        
        this.initAdvancedEffects();
    }
    
    initAdvancedEffects() {
        // Aggiungi glow effect
        this.element.style.transition = 'all 0.3s ease';
        
        // Crea elemento glow
        this.glowElement = document.createElement('div');
        this.glowElement.className = 'tilt-glow';
        this.glowElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(this.glowElement);
    }
    
    updateTiltFromCoordinates(x, y, width, height) {
        super.updateTiltFromCoordinates(x, y, width, height);
        
        // Calcola intensità del glow basata sulla posizione del mouse
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceX = Math.abs(x - centerX) / centerX;
        const distanceY = Math.abs(y - centerY) / centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        const glowOpacity = Math.max(0, 1 - distance) * this.glowIntensity;
        const shadowIntensity = Math.max(0, 1 - distance) * this.shadowIntensity;
        
        // Aggiorna glow
        this.glowElement.style.opacity = glowOpacity;
        this.glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 209, 178, 0.3), transparent)`;
        
        // Aggiorna ombra
        const shadowColor = `rgba(0, 209, 178, ${shadowIntensity})`;
        this.element.style.boxShadow = `
            ${this.originalBoxShadow},
            0 0 20px ${shadowColor},
            0 0 40px ${shadowColor}
        `;
    }
    
    onMouseLeave() {
        super.onMouseLeave();
        
        // Ripristina effetti
        this.glowElement.style.opacity = '0';
        this.element.style.boxShadow = this.originalBoxShadow;
    }
    
    destroy() {
        if (this.glowElement) {
            this.glowElement.remove();
        }
        super.destroy();
    }
}

// Funzione per applicare effetti tilt avanzati
window.applyAdvancedTiltEffect = function(element, options = {}) {
    if (element.classList.contains('advanced-tilt-initialized')) {
        return;
    }
    
    element.classList.add('advanced-tilt-initialized');
    
    const advancedOptions = {
        max: 15,
        perspective: 1000,
        scale: 1.05,
        speed: 500,
        reverse: false,
        glowIntensity: 0.3,
        shadowIntensity: 0.5,
        ...options
    };
    
    if (!element.advancedTiltEffect) {
        element.advancedTiltEffect = new AdvancedTiltEffect(element, advancedOptions);
    }
    
    return element.advancedTiltEffect;
};

// Inizializza effetti tilt quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Piccolo delay per assicurarsi che tutti gli elementi siano renderizzati
    setTimeout(() => {
        window.initTiltEffects();
    }, 100);
});

// Reinizializza effetti tilt quando vengono aggiunti nuovi elementi
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Controlla se il nuovo elemento ha bisogno di effetti tilt
                    if (node.classList && (
                        node.classList.contains('car-card') ||
                        node.classList.contains('brand-logo') ||
                        node.classList.contains('glass-pill')
                    )) {
                        window.applyTiltEffect(node);
                    }
                    
                    // Controlla anche i figli
                    node.querySelectorAll('.car-card, .brand-logo, .glass-pill').forEach(element => {
                        if (!element.classList.contains('tilt-initialized')) {
                            window.applyTiltEffect(element);
                        }
                    });
                }
            });
        }
    });
});

// Inizia a osservare le mutazioni del DOM
if (document.body) {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

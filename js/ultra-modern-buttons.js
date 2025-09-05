/**
 * Wali Wheels - Ultra Modern Buttons Interaction System
 * Sistema di interazione per pulsanti ultra-moderni
 */

class UltraModernButtons {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeButtons();
        this.addFloatingButtons();
    }

    bindEvents() {
        // Ripple effect
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-ultra-modern') && e.target.classList.contains('ripple')) {
                this.createRipple(e);
            }
        });

        // Magnetic effect
        document.addEventListener('mousemove', (e) => {
            this.handleMagneticEffect(e);
        });

        // Loading states
        document.addEventListener('submit', (e) => {
            if (e.target.closest('form')) {
                this.handleFormSubmission(e);
            }
        });

        // Progress buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-ultra-modern') && e.target.classList.contains('progress')) {
                this.handleProgressButton(e);
            }
        });

        // Badge updates
        this.updateBadges();
    }

    initializeButtons() {
        // Add default classes to existing buttons
        const buttons = document.querySelectorAll('button, .btn, .glass-button, a[href]');
        
        buttons.forEach(button => {
            if (!button.classList.contains('btn-ultra-modern')) {
                // Skip navigation and special buttons
                if (button.closest('.nav-menu') || 
                    button.closest('.profile-menu') || 
                    button.classList.contains('mobile-menu-toggle') ||
                    button.classList.contains('theme-toggle')) {
                    return;
                }

                // Add ultra-modern classes
                button.classList.add('btn-ultra-modern', 'shimmer', 'magnetic');
                
                // Add appropriate variant based on existing classes
                if (button.classList.contains('primary')) {
                    button.classList.add('primary');
                } else if (button.classList.contains('danger')) {
                    button.classList.add('danger');
                } else if (button.classList.contains('outline')) {
                    button.classList.add('outline');
                } else {
                    button.classList.add('secondary');
                }

                // Add size classes
                if (button.classList.contains('small')) {
                    button.classList.add('small');
                } else if (button.classList.contains('large')) {
                    button.classList.add('large');
                }

                // Add special effects
                if (button.textContent.includes('Salva') || button.textContent.includes('Submit')) {
                    button.classList.add('glow');
                }
                
                if (button.textContent.includes('Elimina') || button.textContent.includes('Delete')) {
                    button.classList.add('danger', 'pulse');
                }

                // Add icons if needed
                this.addIconsToButtons(button);
            }
        });
    }

    addIconsToButtons(button) {
        const text = button.textContent.toLowerCase();
        
        if (text.includes('salva') || text.includes('save')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('elimina') || text.includes('delete')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('aggiungi') || text.includes('add')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('modifica') || text.includes('edit')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('esplora') || text.includes('explore')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('contatti') || text.includes('contact')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                ${button.textContent}
            `;
        } else if (text.includes('torna') || text.includes('back')) {
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                ${button.textContent}
            `;
        }
    }

    addFloatingButtons() {
        // Add floating action button
        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'btn-ultra-modern floating primary shimmer magnetic';
        floatingBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        `;
        floatingBtn.title = 'Torna in cima';
        floatingBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                floatingBtn.style.display = 'flex';
            } else {
                floatingBtn.style.display = 'none';
            }
        });
        
        document.body.appendChild(floatingBtn);

        // Add floating contact button
        const contactBtn = document.createElement('button');
        contactBtn.className = 'btn-ultra-modern floating secondary shimmer magnetic';
        contactBtn.style.bottom = '100px';
        contactBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        `;
        contactBtn.title = 'Contattaci';
        contactBtn.onclick = () => window.location.href = 'contatti.html';
        
        document.body.appendChild(contactBtn);
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleMagneticEffect(event) {
        const magneticButtons = document.querySelectorAll('.btn-ultra-modern.magnetic');
        
        magneticButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(event.clientX - centerX, 2) + 
                Math.pow(event.clientY - centerY, 2)
            );
            
            if (distance < 100) {
                const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
                const force = (100 - distance) / 100;
                const moveX = Math.cos(angle) * force * 5;
                const moveY = Math.sin(angle) * force * 5;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                button.style.transform = 'translate(0, 0)';
            }
        });
    }

    handleFormSubmission(event) {
        const submitButton = event.target.querySelector('button[type="submit"]');
        if (submitButton && submitButton.classList.contains('btn-ultra-modern')) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Remove loading state after form processing
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 2000);
        }
    }

    handleProgressButton(event) {
        const button = event.target;
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 10;
            button.style.setProperty('--progress', `${progress}%`);
            
            if (progress >= 100) {
                clearInterval(interval);
                button.classList.add('success');
                setTimeout(() => {
                    button.style.setProperty('--progress', '0%');
                    button.classList.remove('success');
                }, 1000);
            }
        }, 100);
    }

    updateBadges() {
        // Update cart badge
        const cartButton = document.querySelector('#cartBtn');
        if (cartButton) {
            const cartCount = localStorage.getItem('waliwheels_cart_count') || 0;
            if (cartCount > 0) {
                cartButton.classList.add('badge');
                cartButton.setAttribute('data-badge', cartCount);
            }
        }

        // Update notifications badge
        const notificationsButton = document.querySelector('#notificationsBtn');
        if (notificationsButton) {
            const notificationsCount = localStorage.getItem('waliwheels_notifications_count') || 0;
            if (notificationsCount > 0) {
                notificationsButton.classList.add('badge');
                notificationsButton.setAttribute('data-badge', notificationsCount);
            }
        }

        // Update compare badge
        const compareButton = document.querySelector('#compareBtn');
        if (compareButton) {
            const compareCount = localStorage.getItem('waliwheels_compare_count') || 0;
            if (compareCount > 0) {
                compareButton.classList.add('badge');
                compareButton.setAttribute('data-badge', compareCount);
            }
        }
    }

    // Utility methods
    showLoading(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    hideLoading(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    setProgress(button, progress) {
        button.style.setProperty('--progress', `${progress}%`);
    }

    addBadge(button, count) {
        button.classList.add('badge');
        button.setAttribute('data-badge', count);
    }

    removeBadge(button) {
        button.classList.remove('badge');
        button.removeAttribute('data-badge');
    }
}

// Add ripple animation CSS
const rippleStyles = `
<style>
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', rippleStyles);

// Initialize Ultra Modern Buttons
const ultraModernButtons = new UltraModernButtons();

// Global functions for external use
window.UltraModernButtons = {
    showLoading: (button) => ultraModernButtons.showLoading(button),
    hideLoading: (button) => ultraModernButtons.hideLoading(button),
    setProgress: (button, progress) => ultraModernButtons.setProgress(button, progress),
    addBadge: (button, count) => ultraModernButtons.addBadge(button, count),
    removeBadge: (button) => ultraModernButtons.removeBadge(button)
};











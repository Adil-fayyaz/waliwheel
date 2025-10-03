// ===== 3D CAR INTERACTIONS =====

class Car3DInteractions {
    constructor() {
        this.carModel = document.getElementById('showcaseCar');
        this.controlBtns = document.querySelectorAll('.control-btn');
        this.isRotating = false;
        this.isZoomed = false;
        this.isLightingActive = false;
        this.init();
    }

    init() {
        this.setupControlButtons();
        this.setupCarModelInteractions();
        this.setupKeyboardControls();
    }

    setupControlButtons() {
        this.controlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleControlAction(action, e.currentTarget);
            });
        });
    }

    setupCarModelInteractions() {
        if (!this.carModel) return;

        // Mouse drag to rotate
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let rotationX = 0;
        let rotationY = 0;

        this.carModel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.carModel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5;

            this.carModel.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.carModel.style.cursor = 'grab';
        });

        // Touch support
        this.carModel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5;

            this.carModel.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Hover effects
        this.carModel.addEventListener('mouseenter', () => {
            this.carModel.style.transform += ' scale(1.05)';
        });

        this.carModel.addEventListener('mouseleave', () => {
            this.carModel.style.transform = this.carModel.style.transform.replace(' scale(1.05)', '');
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'r':
                case 'R':
                    this.handleControlAction('rotate');
                    break;
                case 'z':
                case 'Z':
                    this.handleControlAction('zoom');
                    break;
                case 'l':
                case 'L':
                    this.handleControlAction('lighting');
                    break;
                case 'Escape':
                    this.resetCarModel();
                    break;
            }
        });
    }

    handleControlAction(action, button) {
        switch(action) {
            case 'rotate':
                this.toggleRotation(button);
                break;
            case 'zoom':
                this.toggleZoom(button);
                break;
            case 'lighting':
                this.toggleLighting(button);
                break;
        }
    }

    toggleRotation(button) {
        this.isRotating = !this.isRotating;
        
        if (this.isRotating) {
            this.carModel.classList.add('rotating');
            button.classList.add('active');
            button.textContent = '⏹️ Stop';
        } else {
            this.carModel.classList.remove('rotating');
            button.classList.remove('active');
            button.textContent = '🔄 Ruota';
        }
    }

    toggleZoom(button) {
        this.isZoomed = !this.isZoomed;
        
        if (this.isZoomed) {
            this.carModel.classList.add('zoomed');
            button.classList.add('active');
            button.textContent = '🔍 Zoom Out';
        } else {
            this.carModel.classList.remove('zoomed');
            button.classList.remove('active');
            button.textContent = '🔍 Zoom';
        }
    }

    toggleLighting(button) {
        this.isLightingActive = !this.isLightingActive;
        
        if (this.isLightingActive) {
            this.carModel.classList.add('lighting-active');
            button.classList.add('active');
            button.textContent = '💡 Spegni';
        } else {
            this.carModel.classList.remove('lighting-active');
            button.classList.remove('active');
            button.textContent = '💡 Illuminazione';
        }
    }

    resetCarModel() {
        this.isRotating = false;
        this.isZoomed = false;
        this.isLightingActive = false;

        this.carModel.classList.remove('rotating', 'zoomed', 'lighting-active');
        this.carModel.style.transform = '';

        this.controlBtns.forEach(btn => {
            btn.classList.remove('active');
            const action = btn.dataset.action;
            switch(action) {
                case 'rotate':
                    btn.textContent = '🔄 Ruota';
                    break;
                case 'zoom':
                    btn.textContent = '🔍 Zoom';
                    break;
                case 'lighting':
                    btn.textContent = '💡 Illuminazione';
                    break;
            }
        });
    }
}

// Enhanced Car Card Interactions
class EnhancedCarCards {
    constructor() {
        this.carCards = document.querySelectorAll('.car-card');
        this.init();
    }

    init() {
        this.setupCardInteractions();
        this.setupLazyLoading();
    }

    setupCardInteractions() {
        this.carCards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = (y / rect.height) * 20;
                const rotateY = (x / rect.width) * 20;
                
                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Click to view details
            card.addEventListener('click', () => {
                const carId = card.dataset.carId;
                if (carId) {
                    this.showCarDetails(carId);
                }
            });

            // Favorite toggle
            const favoriteBtn = card.querySelector('.car-favorite');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(favoriteBtn);
                });
            }
        });
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    toggleFavorite(button) {
        const isActive = button.classList.contains('active');
        
        if (isActive) {
            button.classList.remove('active');
            this.showToast('Auto rimossa dai preferiti', 'info');
        } else {
            button.classList.add('active');
            this.showToast('Auto aggiunta ai preferiti', 'success');
        }

        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    showCarDetails(carId) {
        // Animate card click
        const card = document.querySelector(`[data-car-id="${carId}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
                window.location.href = `dettagli-macchina.html?id=${carId}`;
            }, 150);
        }
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff6b6b'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
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
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D car interactions
    if (document.getElementById('showcaseCar')) {
        window.car3DInteractions = new Car3DInteractions();
    }

    // Initialize enhanced car cards
    window.enhancedCarCards = new EnhancedCarCards();

    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 1rem; border-radius: 10px; font-size: 0.8rem; z-index: 1000;">
            <strong>Scorciatoie:</strong><br>
            R - Ruota<br>
            Z - Zoom<br>
            L - Luci<br>
            ESC - Reset
        </div>
    `;
    document.body.appendChild(shortcutsInfo);

    // Hide shortcuts info after 5 seconds
    setTimeout(() => {
        shortcutsInfo.style.opacity = '0';
        shortcutsInfo.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            shortcutsInfo.remove();
        }, 500);
    }, 5000);
});

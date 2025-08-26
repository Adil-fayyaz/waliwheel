// AutoShop Premium - JavaScript Principale

class AutoShopApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.compareList = JSON.parse(sessionStorage.getItem('compareList')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedCars();
        this.setupCategoryPills();
        this.setupThemeToggle();
        this.setupCookieBanner();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupCart();
        this.setupAuth();
        this.setupCheckout();
        this.setupAdvancedFilters();
        this.setupFinancingCalculator();
        this.setupCarComparison();
        this.updateCartCount();
        this.updateAuthUI();
        this.initAdvancedAnimations();
        
        // Inizializza nuove funzionalità
        this.initHeroStats();
        this.initCategoryCards();
        this.initEnhancedFinancing();
    }

    setupEventListeners() {
        // Event listeners per i bottoni CTA
        document.querySelectorAll('.glass-button.primary, .glass-button.secondary, .glass-button.accent, .glass-button.large').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCTAClick(e);
            });
        });

        // Event listeners per le card auto
        document.addEventListener('click', (e) => {
            if (e.target.closest('.car-favorite')) {
                this.toggleFavorite(e.target.closest('.car-favorite'));
            }
            if (e.target.closest('.glass-button.primary')) {
                this.navigateToDetails(e.target.closest('.glass-button.primary'));
            }
            if (e.target.closest('.glass-button.secondary')) {
                this.toggleCompare(e.target.closest('.glass-button.secondary'));
            }
            if (e.target.closest('.glass-button.accent')) {
                this.addToCart(e.target.closest('.glass-button.accent'));
            }
        });

        // Event listeners per le pillole categoria
        document.querySelectorAll('.glass-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                this.handleCategoryClick(e.target.closest('.glass-pill'));
            });
        });

        // Event listeners per i link di navigazione
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavigation(e.target);
            });
        });

        // Event listeners per i form
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });
    }

    // ===== SISTEMA CARRRELLO =====
    setupCart() {
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartClose = document.getElementById('cartClose');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.openCheckout());
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar.classList.contains('open')) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.renderCart();
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    addToCart(btn) {
        const carId = parseInt(btn.dataset.carId);
        const car = this.getCarById(carId);
        
        if (!car) return;

        const existingItem = this.cart.find(item => item.id === carId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: car.id,
                titolo: car.titolo,
                prezzo: car.prezzo,
                immagine: car.immagini[0],
                marca: car.marca,
                modello: car.modello,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast('Auto aggiunta al carrello', 'success');
        
        // Aggiorna il pulsante
        btn.innerHTML = `
            <svg class="cart-icon-small" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Aggiunta ✓
        `;
        btn.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            btn.innerHTML = `
                <svg class="cart-icon-small" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Aggiungi al Carrello
            `;
            btn.style.background = '';
        }, 2000);
    }

    removeFromCart(carId) {
        this.cart = this.cart.filter(item => item.id !== carId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showToast('Auto rimossa dal carrello', 'info');
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Sei sicuro di voler svuotare il carrello?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
            this.showToast('Carrello svuotato', 'info');
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotalPrice = document.getElementById('cartTotalPrice');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (this.cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'flex';
            checkoutBtn.disabled = true;
            cartTotalPrice.textContent = '€0';
            return;
        }
        
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        checkoutBtn.disabled = false;
        
        const total = this.cart.reduce((sum, item) => sum + (item.prezzo * item.quantity), 0);
        cartTotalPrice.textContent = CarUtils.formatPrice(total);
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.immagine}" alt="${item.titolo}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.marca} ${item.modello}</div>
                    <div class="cart-item-price">${CarUtils.formatPrice(item.prezzo)}</div>
                </div>
                <button class="cart-item-remove" onclick="window.autoShopApp.removeFromCart(${item.id})">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // ===== SISTEMA AUTENTICAZIONE =====
    setupAuth() {
        const authBtn = document.getElementById('authBtn');
        const authModal = document.getElementById('authModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const authModalClose = document.getElementById('authModalClose');
        const authSwitchToRegister = document.getElementById('authSwitchToRegister');
        const authSwitchToLogin = document.getElementById('authSwitchToLogin');
        const googleAuthBtn = document.getElementById('googleAuthBtn');

        if (authBtn) {
            authBtn.addEventListener('click', () => this.openAuthModal('login'));
        }



        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeAuthModal());
        }

        if (authModalClose) {
            authModalClose.addEventListener('click', () => this.closeAuthModal());
        }

        if (authSwitchToRegister) {
            authSwitchToRegister.addEventListener('click', () => this.switchAuthForm('register'));
        }

        if (googleAuthBtn) {
            googleAuthBtn.addEventListener('click', () => this.googleAuth());
        }

        // Form submission
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    openAuthModal(type) {
        const authModal = document.getElementById('authModal');
        const modalOverlay = document.getElementById('modalOverlay');
        
        this.switchAuthForm(type);
        authModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        const modalOverlay = document.getElementById('modalOverlay');
        
        authModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authModalTitle = document.getElementById('authModalTitle');
        const authModalFooterText = document.getElementById('authModalFooterText');
        const authSwitchToRegister = document.getElementById('authSwitchToRegister');
        const authSwitchToLogin = document.getElementById('authSwitchToLogin');

        if (type === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            authModalTitle.textContent = 'Accedi';
            authModalFooterText.innerHTML = 'Non hai un account? <button class="auth-switch" id="authSwitchToRegister">Registrati</button>';
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            authModalTitle.textContent = 'Registrati';
            authModalFooterText.innerHTML = 'Hai già un account? <button class="auth-switch" id="authSwitchToLogin">Accedi</button>';
        }

        // Re-attach event listeners
        if (authSwitchToRegister) {
            authSwitchToRegister.addEventListener('click', () => this.switchAuthForm('register'));
        }
        if (authSwitchToLogin) {
            authSwitchToLogin.addEventListener('click', () => this.switchAuthForm('login'));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simula login (in produzione usare API reali)
        try {
            // Simula chiamata API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.user = {
                id: 1,
                name: 'Utente Demo',
                email: email,
                avatar: 'https://via.placeholder.com/150/00D1B2/FFFFFF?text=U'
            };
            
            this.saveUser();
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast('Login effettuato con successo', 'success');
        } catch (error) {
            this.showToast('Errore durante il login', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showToast('Le password non coincidono', 'error');
            return;
        }

        try {
            // Simula registrazione (in produzione usare API reali)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.user = {
                id: 1,
                name: name,
                email: email,
                avatar: 'https://via.placeholder.com/150/00D1B2/FFFFFF?text=U'
            };
            
            this.saveUser();
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast('Registrazione completata con successo', 'success');
        } catch (error) {
            this.showToast('Errore durante la registrazione', 'error');
        }
    }

    async googleAuth() {
        try {
            // Simula autenticazione Google (in produzione usare Google OAuth)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.user = {
                id: 1,
                name: 'Utente Google',
                email: 'user@gmail.com',
                avatar: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G'
            };
            
            this.saveUser();
            this.updateAuthUI();
            this.closeAuthModal();
            this.showToast('Accesso con Google completato', 'success');
        } catch (error) {
            this.showToast('Errore durante l\'accesso con Google', 'error');
        }
    }

    logout() {
        this.user = null;
        this.saveUser();
        this.updateAuthUI();
        this.showToast('Logout effettuato', 'info');
    }

    saveUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatarImg = document.getElementById('userAvatarImg');

        if (this.user) {
            authButtons.style.display = 'none';
            userProfile.classList.remove('hidden');
            
            if (userName) userName.textContent = this.user.name;
            if (userEmail) userEmail.textContent = this.user.email;
            if (userAvatarImg) userAvatarImg.src = this.user.avatar;
        } else {
            authButtons.style.display = 'flex';
            userProfile.classList.add('hidden');
        }
    }

    // ===== SISTEMA CHECKOUT =====
    setupCheckout() {
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutOverlay = document.getElementById('checkoutOverlay');
        const checkoutClose = document.getElementById('checkoutClose');
        const checkoutNextBtn = document.getElementById('checkoutNextBtn');
        const checkoutPrevBtn = document.getElementById('checkoutPrevBtn');
        const checkoutConfirmBtn = document.getElementById('checkoutConfirmBtn');

        if (checkoutModal) {
            checkoutModal.addEventListener('click', (e) => {
                if (e.target === checkoutModal) this.closeCheckout();
            });
        }

        if (checkoutOverlay) {
            checkoutOverlay.addEventListener('click', () => this.closeCheckout());
        }

        if (checkoutClose) {
            checkoutClose.addEventListener('click', () => this.closeCheckout());
        }

        if (checkoutNextBtn) {
            checkoutNextBtn.addEventListener('click', () => this.nextCheckoutStep());
        }

        if (checkoutPrevBtn) {
            checkoutPrevBtn.addEventListener('click', () => this.prevCheckoutStep());
        }

        if (checkoutConfirmBtn) {
            checkoutConfirmBtn.addEventListener('click', () => this.confirmOrder());
        }
    }

    openCheckout() {
        if (!this.user) {
            this.showToast('Devi essere loggato per procedere all\'acquisto', 'warning');
            this.openAuthModal('login');
            return;
        }

        if (this.cart.length === 0) {
            this.showToast('Il carrello è vuoto', 'warning');
            return;
        }

        const checkoutModal = document.getElementById('checkoutModal');
        const modalOverlay = document.getElementById('modalOverlay');
        
        checkoutModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.currentCheckoutStep = 1;
        this.updateCheckoutSteps();
        this.renderOrderSummary();
    }

    closeCheckout() {
        const checkoutModal = document.getElementById('checkoutModal');
        const modalOverlay = document.getElementById('modalOverlay');
        
        checkoutModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextCheckoutStep() {
        if (this.currentCheckoutStep < 3) {
            this.currentCheckoutStep++;
            this.updateCheckoutSteps();
        }
    }

    prevCheckoutStep() {
        if (this.currentCheckoutStep > 1) {
            this.currentCheckoutStep--;
            this.updateCheckoutSteps();
        }
    }

    updateCheckoutSteps() {
        const steps = document.querySelectorAll('.checkout-steps .step');
        const stepContents = document.querySelectorAll('.checkout-step-content');
        const nextBtn = document.getElementById('checkoutNextBtn');
        const prevBtn = document.getElementById('checkoutPrevBtn');
        const confirmBtn = document.getElementById('checkoutConfirmBtn');

        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentCheckoutStep);
        });

        stepContents.forEach((content, index) => {
            content.classList.toggle('hidden', index + 1 !== this.currentCheckoutStep);
        });

        prevBtn.style.display = this.currentCheckoutStep > 1 ? 'block' : 'none';
        nextBtn.style.display = this.currentCheckoutStep < 3 ? 'block' : 'none';
        confirmBtn.style.display = this.currentCheckoutStep === 3 ? 'block' : 'none';
    }

    renderOrderSummary() {
        const orderSummaryItems = document.getElementById('orderSummaryItems');
        const orderTotalPrice = document.getElementById('orderTotalPrice');
        
        const total = this.cart.reduce((sum, item) => sum + (item.prezzo * item.quantity), 0);
        
        orderSummaryItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.marca} ${item.modello}</span>
                <span>${CarUtils.formatPrice(item.prezzo)}</span>
            </div>
        `).join('');
        
        orderTotalPrice.textContent = CarUtils.formatPrice(total);
    }

    async confirmOrder() {
        try {
            // Simula conferma ordine (in produzione usare API reali)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('Ordine confermato con successo!', 'success');
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.closeCheckout();
            this.closeCart();
            
            // Invia email di conferma (simulato)
            setTimeout(() => {
                this.showToast('Email di conferma inviata', 'info');
            }, 1000);
            
        } catch (error) {
            this.showToast('Errore durante la conferma dell\'ordine', 'error');
        }
    }

    // ===== UTILITY FUNCTIONS =====
    getCarById(id) {
        return window.carsDatabase?.find(car => car.id === id) || null;
    }

    setupCategoryPills() {
        const pills = document.querySelectorAll('.glass-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Rimuovi classe active da tutte le pillole
                pills.forEach(p => p.classList.remove('active'));
                // Aggiungi classe active alla pillola cliccata
                pill.classList.add('active');
                
                const category = pill.dataset.category;
                this.filterCarsByCategory(category);
            });
        });
    }

    filterCarsByCategory(category) {
        const cars = category === 'tutte' ? 
            CarUtils.getFeaturedCars() : 
            CarUtils.getCarsByCategory(category);
        
        this.renderCarsGrid(cars, document.getElementById('featuredCars'));
        
        // Animazione per le nuove card
        gsap.fromTo('.car-card', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
        );
    }

    loadFeaturedCars() {
        const featuredCars = CarUtils.getFeaturedCars();
        this.renderCarsGrid(featuredCars, document.getElementById('featuredCars'));
    }

    renderCarsGrid(cars, container) {
        if (!container) return;

        container.innerHTML = cars.map(car => this.createCarCard(car)).join('');
        
        // Applica effetti tilt alle nuove card
        this.applyTiltEffects();
        
        // Aggiorna i contatori
        this.updateCarCounters(cars.length);
    }

    createCarCard(car) {
        const isFavorite = this.favorites.includes(car.id);
        const isInCompare = this.compareList.includes(car.id);
        
        return `
            <div class="car-card glass" data-car-id="${car.id}">
                <div class="car-image-container">
                    <img src="${car.immagini[0]}" alt="${car.titolo}" class="car-image" loading="lazy">
                    <div class="car-badge">${car.badge[0]}</div>
                    <button class="car-favorite ${isFavorite ? 'active' : ''}" data-car-id="${car.id}">
                        <svg viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="car-content">
                    <h3 class="car-title">${car.titolo}</h3>
                    
                    <div class="car-specs">
                        <span class="car-spec">
                            <span class="spec-icon">📅</span>
                            ${car.anno}
                        </span>
                        <span class="car-spec">
                            <span class="spec-icon">🛣️</span>
                            ${CarUtils.formatKm(car.km)}
                        </span>
                        <span class="car-spec">
                            <span class="spec-icon">⚙️</span>
                            ${car.cambio}
                        </span>
                        <span class="car-spec">
                            <span class="spec-icon">⛽</span>
                            ${car.alimentazione}
                        </span>
                        <span class="car-spec">
                            <span class="spec-icon">🐎</span>
                            ${car.potenza_cv} CV
                        </span>
                    </div>
                    
                    <div class="car-price">${CarUtils.formatPrice(car.prezzo)}</div>
                    
                    <div class="car-actions">
                        <button class="glass-button primary shimmer" data-car-id="${car.id}">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Dettagli
                        </button>
                        <button class="glass-button secondary ${isInCompare ? 'pulse' : 'shimmer'}" data-car-id="${car.id}">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm0-8h2v2h-2V7zm4 0h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                            </svg>
                            ${isInCompare ? 'Rimuovi' : 'Confronta'}
                        </button>
                        <button class="glass-button accent shimmer" data-car-id="${car.id}">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                            Aggiungi al Carrello
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    applyTiltEffects() {
        // Applica effetti tilt alle card auto
        if (window.applyTiltEffect) {
            document.querySelectorAll('.car-card').forEach(card => {
                window.applyTiltEffect(card);
            });
        }
    }

    updateCarCounters(count) {
        // Aggiorna i contatori delle auto mostrate
        const counters = document.querySelectorAll('.car-counter');
        counters.forEach(counter => {
            counter.textContent = count;
        });
    }

    toggleFavorite(favoriteBtn) {
        const carId = parseInt(favoriteBtn.dataset.carId);
        const isFavorite = this.favorites.includes(carId);
        
        if (isFavorite) {
            this.favorites = this.favorites.filter(id => id !== carId);
            favoriteBtn.classList.remove('active');
            this.showToast('Auto rimossa dai preferiti', 'info');
        } else {
            this.favorites.push(carId);
            favoriteBtn.classList.add('active');
            this.showToast('Auto aggiunta ai preferiti', 'success');
        }
        
        // Aggiorna localStorage
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        
        // Aggiorna l'icona
        const svg = favoriteBtn.querySelector('svg');
        if (isFavorite) {
            svg.setAttribute('fill', 'none');
        } else {
            svg.setAttribute('fill', 'currentColor');
        }
    }

    toggleCompare(compareBtn) {
        const carId = parseInt(compareBtn.dataset.carId);
        const isInCompare = this.compareList.includes(carId);
        
        if (isInCompare) {
            this.compareList = this.compareList.filter(id => id !== carId);
            compareBtn.textContent = 'Confronta';
            compareBtn.classList.remove('active');
            this.showToast('Auto rimossa dal confronto', 'info');
        } else {
            if (this.compareList.length >= 4) {
                this.showToast('Puoi confrontare massimo 4 auto', 'warning');
                return;
            }
            this.compareList.push(carId);
            compareBtn.textContent = 'Rimuovi';
            compareBtn.classList.add('active');
            this.showToast('Auto aggiunta al confronto', 'success');
        }
        
        // Aggiorna sessionStorage
        sessionStorage.setItem('compareList', JSON.stringify(this.compareList));
        
        // Aggiorna il contatore del confronto
        this.updateCompareCounter();
    }

    updateCompareCounter() {
        const compareCount = this.compareList.length;
        const compareBadges = document.querySelectorAll('.compare-badge');
        
        compareBadges.forEach(badge => {
            badge.textContent = compareCount;
            badge.style.display = compareCount > 0 ? 'block' : 'none';
        });
    }

    navigateToDetails(detailsBtn) {
        const carId = detailsBtn.dataset.carId || detailsBtn.dataset.carSlug;
        if (carId) {
            window.location.href = `car-detail-template.html?id=${carId}`;
        }
    }

    handleCategoryClick(pill) {
        const category = pill.dataset.category;
        this.filterCarsByCategory(category);
    }

    handleCTAClick(event) {
        const btn = event.currentTarget;
        const btnText = btn.textContent || btn.querySelector('span')?.textContent;
        
        if (btnText?.includes('Test Drive')) {
            this.showTestDriveModal();
        } else if (btnText?.includes('Macchine') || btnText?.includes('Catalogo')) {
            this.showToast('Apertura pagina macchine...', 'info');
            setTimeout(() => {
                window.location.href = 'macchine.html';
            }, 500);
        } else if (btnText?.includes('Prenota')) {
            this.showBookingModal();
        } else if (btnText?.includes('Finanziamento')) {
            document.getElementById('finanziamento')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleNavigation(link) {
        // Rimuovi classe active da tutti i link
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        
        // Aggiungi classe active al link cliccato
        link.classList.add('active');
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        if (form.classList.contains('newsletter-form')) {
            this.handleNewsletterSubmit(form);
        }
    }

    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (email) {
            this.showToast('Iscrizione alla newsletter completata!', 'success');
            form.reset();
        }
    }

    showTestDriveModal() {
        // Mostra modale per prenotazione test drive
        this.showToast('Funzionalità test drive in sviluppo', 'info');
    }

    showBookingModal() {
        // Mostra modale per prenotazioni
        this.showToast('Funzionalità prenotazioni in sviluppo', 'info');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Imposta tema iniziale
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Aggiorna icona
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.style.transform = this.currentTheme === 'light' ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        
        this.showToast(`Tema ${this.currentTheme === 'dark' ? 'scuro' : 'chiaro'} attivato`, 'success');
    }

    setupCookieBanner() {
        const cookieBanner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('acceptCookies');
        
        if (!cookieBanner || !acceptBtn) return;

        // Controlla se i cookie sono già stati accettati
        if (localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'none';
            return;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
            this.showToast('Preferenze cookie salvate', 'success');
        });
    }

    setupScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header-glass');
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Parallax effect per hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxLayers = document.querySelectorAll('.parallax-layer');
            
            parallaxLayers.forEach(layer => {
                const speed = layer.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
        });

        // Chiudi menu mobile quando si clicca su un link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Mostra toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Chiudi toast automaticamente
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);

        // Chiudi toast manualmente
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }

    // Metodi pubblici per altre parti dell'app
    getFavorites() {
        return this.favorites;
    }

    getCompareList() {
        return this.compareList;
    }

    getCart() {
        return this.cart;
    }

    getUser() {
        return this.user;
    }

    addToFavorites(carId) {
        if (!this.favorites.includes(carId)) {
            this.favorites.push(carId);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        }
    }

    removeFromFavorites(carId) {
        this.favorites = this.favorites.filter(id => id !== carId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    addToCompare(carId) {
        if (this.compareList.length >= 3) {
            this.showToast('Puoi confrontare massimo 3 auto', 'warning');
            return false;
        }

        if (this.compareList.includes(carId)) {
            this.removeFromCompare(carId);
            return false;
        }

        this.compareList.push(carId);
        sessionStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareUI();
        this.showToast('Auto aggiunta al confronto', 'success');
        return true;
    }

    removeFromCompare(carId) {
        this.compareList = this.compareList.filter(id => id !== carId);
        sessionStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareUI();
        this.showToast('Auto rimossa dal confronto', 'info');
    }

    clearCarComparison() {
        this.compareList = [];
        sessionStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareUI();
        this.showToast('Confronto cancellato', 'info');
    }

    updateCompareUI() {
        const compareSection = document.getElementById('compareSection');
        const compareCarsContainer = document.getElementById('compareCars');
        const compareCount = document.getElementById('compareCount');

        if (compareCount) {
            compareCount.textContent = this.compareList.length;
            compareCount.style.display = this.compareList.length > 0 ? 'block' : 'none';
        }

        if (compareSection) {
            compareSection.style.display = this.compareList.length > 0 ? 'block' : 'none';
        }

        if (compareCarsContainer && this.compareList.length > 0) {
            this.renderCompareCars();
        }
    }

    renderCompareCars() {
        const compareCarsContainer = document.getElementById('compareCars');
        if (!compareCarsContainer) return;

        compareCarsContainer.innerHTML = '';

        this.compareList.forEach(carId => {
            const car = this.getCarById(carId);
            if (car) {
                const compareCard = this.createCompareCard(car);
                compareCarsContainer.appendChild(compareCard);
            }
        });
    }

    createCompareCard(car) {
        const card = document.createElement('div');
        card.className = 'compare-card';
        card.innerHTML = `
            <div class="compare-card-header">
                <img src="${car.immagini[0]}" alt="${car.titolo}" class="compare-card-image">
                <button class="compare-remove-btn" onclick="window.autoShopApp.removeFromCompare(${car.id})">
                    <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
            <div class="compare-card-content">
                <h3 class="compare-card-title">${car.titolo}</h3>
                <div class="compare-card-specs">
                    <div class="spec-item">
                        <span class="spec-label">Prezzo:</span>
                        <span class="spec-value">${CarUtils.formatPrice(car.prezzo)}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Anno:</span>
                        <span class="spec-value">${car.anno}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Potenza:</span>
                        <span class="spec-value">${car.potenza_cv} CV</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">0-100:</span>
                        <span class="spec-value">${car["0_100"]}s</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // ===== SISTEMA FILTRI AVANZATI =====
    setupAdvancedFilters() {
        const applyFiltersBtn = document.getElementById('applyFilters');
        const clearFiltersBtn = document.getElementById('clearFilters');
        const priceRange = document.getElementById('priceRange');
        const yearRange = document.getElementById('yearRange');
        const fuelType = document.getElementById('fuelType');
        const transmission = document.getElementById('transmission');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyAdvancedFilters());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAdvancedFilters());
        }

        // Auto-apply filters on change
        [priceRange, yearRange, fuelType, transmission].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyAdvancedFilters());
            }
        });
    }

    applyAdvancedFilters() {
        const priceRange = document.getElementById('priceRange')?.value;
        const yearRange = document.getElementById('yearRange')?.value;
        const fuelType = document.getElementById('fuelType')?.value;
        const transmission = document.getElementById('transmission')?.value;

        let filteredCars = [...carsDatabase];

        // Filtra per prezzo
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            filteredCars = filteredCars.filter(car => {
                if (max === Infinity) return car.prezzo >= min;
                return car.prezzo >= min && car.prezzo <= max;
            });
        }

        // Filtra per anno
        if (yearRange) {
            filteredCars = filteredCars.filter(car => car.anno === parseInt(yearRange));
        }

        // Filtra per alimentazione
        if (fuelType) {
            filteredCars = filteredCars.filter(car => car.alimentazione === fuelType);
        }

        // Filtra per cambio
        if (transmission) {
            filteredCars = filteredCars.filter(car => car.cambio.includes(transmission));
        }

        this.renderFilteredCars(filteredCars);
        this.showToast(`Trovate ${filteredCars.length} auto`, 'success');
    }

    clearAdvancedFilters() {
        const filters = ['priceRange', 'yearRange', 'fuelType', 'transmission'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) filter.value = '';
        });

        this.renderFilteredCars(carsDatabase);
        this.showToast('Filtri cancellati', 'info');
    }

    renderFilteredCars(cars) {
        const featuredCarsContainer = document.getElementById('featuredCars');
        if (!featuredCarsContainer) return;

        featuredCarsContainer.innerHTML = '';
        
        if (cars.length === 0) {
            featuredCarsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🚗</div>
                    <h3>Nessuna auto trovata</h3>
                    <p>Prova a modificare i filtri di ricerca</p>
                </div>
            `;
            return;
        }

        cars.forEach(car => {
            const carCard = this.createCarCard(car);
            featuredCarsContainer.appendChild(carCard);
        });
    }

    // ===== CALCOLATORE FINANZIAMENTO =====
    setupFinancingCalculator() {
        const calculateBtn = document.getElementById('calculateLoan');
        const carPriceInput = document.getElementById('carPrice');
        const downPaymentInput = document.getElementById('downPayment');
        const loanTermSelect = document.getElementById('loanTerm');
        const interestRateInput = document.getElementById('interestRate');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateLoan());
        }

        // Auto-calculate on input change
        [carPriceInput, downPaymentInput, loanTermSelect, interestRateInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculateLoan());
            }
        });

        // Set default values
        if (carPriceInput) carPriceInput.value = '50000';
        if (downPaymentInput) downPaymentInput.value = '10000';
        if (interestRateInput) interestRateInput.value = '3.9';
    }

    calculateLoan() {
        const carPrice = parseFloat(document.getElementById('carPrice')?.value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment')?.value) || 0;
        const loanTerm = parseInt(document.getElementById('loanTerm')?.value) || 36;
        const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 0;

        if (carPrice <= 0 || downPayment < 0 || loanTerm <= 0 || interestRate < 0) {
            return;
        }

        const loanAmount = carPrice - downPayment;
        if (loanAmount <= 0) {
            this.showToast('L\'acconto non può essere maggiore del prezzo dell\'auto', 'error');
            return;
        }

        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;

        let monthlyPayment = 0;
        if (monthlyRate > 0) {
            monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        } else {
            monthlyPayment = loanAmount / numberOfPayments;
        }

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;

        // Aggiorna i risultati
        this.updateLoanResults(monthlyPayment, loanAmount, totalInterest, totalPayment, loanTerm);
    }

    updateLoanResults(monthlyPayment, loanAmount, totalInterest, totalPayment, loanTerm) {
        const monthlyPaymentEl = document.getElementById('monthlyPayment');
        const totalLoanEl = document.getElementById('totalLoan');
        const totalInterestEl = document.getElementById('totalInterest');
        const totalPaymentEl = document.getElementById('totalPayment');
        const resultTermEl = document.getElementById('resultTerm');

        if (monthlyPaymentEl) {
            monthlyPaymentEl.textContent = CarUtils.formatPrice(monthlyPayment);
        }
        if (totalLoanEl) {
            totalLoanEl.textContent = CarUtils.formatPrice(loanAmount);
        }
        if (totalInterestEl) {
            totalInterestEl.textContent = CarUtils.formatPrice(totalInterest);
        }
        if (totalPaymentEl) {
            totalPaymentEl.textContent = CarUtils.formatPrice(totalPayment);
        }
        if (resultTermEl) {
            resultTermEl.textContent = loanTerm;
        }
    }

    // ===== SISTEMA CONFRONTO AUTO =====
    setupCarComparison() {
        const clearCompareBtn = document.getElementById('clearCompare');
        const compareBtn = document.getElementById('compareBtn');
        
        if (clearCompareBtn) {
            clearCompareBtn.addEventListener('click', () => this.clearCarComparison());
        }

        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.toggleCompareSection());
        }
    }

    toggleCompareSection() {
        const compareSection = document.getElementById('compareSection');
        if (compareSection) {
            if (this.compareList.length === 0) {
                this.showToast('Aggiungi auto al confronto per visualizzare questa sezione', 'info');
                return;
            }
            
            compareSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ===== ANIMAZIONI AVANZATE =====
    initAdvancedAnimations() {
        // Inizializza le animazioni GSAP se disponibili
        if (window.AdvancedAnimations) {
            try {
                this.advancedAnimations = new window.AdvancedAnimations();
                console.log('🎬 Animazioni avanzate inizializzate con successo!');
            } catch (error) {
                console.warn('⚠️ Errore nell\'inizializzazione delle animazioni avanzate:', error);
            }
        }

        // Inizializza gli effetti 3D se disponibili
        if (window.initTiltEffects) {
            try {
                window.initTiltEffects();
                console.log('🎯 Effetti 3D inizializzati con successo!');
            } catch (error) {
                console.warn('⚠️ Errore nell\'inizializzazione degli effetti 3D:', error);
            }
        }

        // Inizializza le animazioni dei bottoni se disponibili
        if (window.ButtonAnimations) {
            try {
                this.buttonAnimations = new window.ButtonAnimations();
                console.log('🔘 Animazioni bottoni inizializzate con successo!');
            } catch (error) {
                console.warn('⚠️ Errore nell\'inizializzazione delle animazioni bottoni:', error);
            }
        }
    }

    // ===== CATALOGO AUTO =====
    loadCatalogCars() {
        const catalogContainer = document.getElementById('catalogCars');
        if (!catalogContainer) return;

        // Filtra le auto per mostrare solo quelle in evidenza
        const featuredCars = this.cars.filter(car => car.badge.includes('Nuovo') || car.badge.includes('Offerta'));
        
        catalogContainer.innerHTML = featuredCars.map(car => `
            <div class="car-card preserve-3d" data-car-id="${car.id}">
                <div class="car-image-container">
                    <img src="${car.immagini[0]}" alt="${car.nome}" class="car-image">
                    <div class="car-badges">
                        ${car.badge.map(badge => `<span class="car-badge">${badge}</span>`).join('')}
                    </div>
                </div>
                <div class="car-info">
                    <h3 class="car-name">${car.nome}</h3>
                    <p class="car-description">${car.descrizione}</p>
                    <div class="car-specs">
                        <span class="spec-item">${car.anno}</span>
                        <span class="spec-item">${car.chilometraggio} km</span>
                        <span class="spec-item">${car.carburante}</span>
                    </div>
                    <div class="car-price">€${car.prezzo.toLocaleString('it-IT')}</div>
                    <div class="car-actions">
                        <button class="glass-button primary shimmer" onclick="window.autoShopApp.viewCarDetails('${car.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            <span>Dettagli</span>
                        </button>
                        <button class="glass-button outline shimmer" onclick="window.autoShopApp.addToCompare('${car.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm0-8h2v2h-2V7zm4 0h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                            </svg>
                            <span>Confronta</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Inizializza gli effetti 3D per le nuove card
        if (window.initTiltEffects) {
            window.initTiltEffects();
        }
    }

    // ===== NUOVE FUNZIONALITÀ INTERATTIVE =====
    initHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target) => {
            const duration = 2000;
            const start = performance.now();
            const startValue = 0;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });

            card.addEventListener('mouseenter', (e) => {
                this.createCategoryParticles(card);
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                card.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', (e) => {
                card.style.transform = '';
            });
        });
    }

    createCategoryParticles(card) {
        const particleCount = 6;
        const rect = card.getBoundingClientRect();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 10px var(--color-primary);
            `;
            
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1)`, opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    filterByCategory(category) {
        this.showToast(`Filtro applicato: ${category}`, 'success');
        window.location.href = `catalogo.html?category=${category}`;
    }

    initEnhancedFinancing() {
        this.setupRangeSliders();
        this.setupRealTimeCalculation();
        this.setupResultAnimations();
    }

    setupRangeSliders() {
        const sliders = [
            { range: 'carPriceRange', input: 'carPrice' },
            { range: 'downPaymentRange', input: 'downPayment' },
            { range: 'loanTermRange', input: 'loanTerm' },
            { range: 'interestRateRange', input: 'interestRate' }
        ];

        sliders.forEach(({ range, input }) => {
            const rangeElement = document.getElementById(range);
            const inputElement = document.getElementById(input);
            
            if (rangeElement && inputElement) {
                rangeElement.addEventListener('input', (e) => {
                    inputElement.value = e.target.value;
                    this.calculateLoanRealTime();
                });

                inputElement.addEventListener('input', (e) => {
                    rangeElement.value = e.target.value;
                    this.calculateLoanRealTime();
                });
            }
        });
    }

    setupRealTimeCalculation() {
        const inputs = ['carPrice', 'downPayment', 'loanTerm', 'interestRate'];
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.calculateLoanRealTime();
                });
            }
        });
    }

    calculateLoanRealTime() {
        const carPrice = parseFloat(document.getElementById('carPrice')?.value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment')?.value) || 0;
        const loanTerm = parseInt(document.getElementById('loanTerm')?.value) || 36;
        const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 3.9;

        if (carPrice > 0) {
            const loanAmount = carPrice - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const numPayments = loanTerm;

            let monthlyPayment = 0;
            if (monthlyRate > 0) {
                monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                (Math.pow(1 + monthlyRate, numPayments) - 1);
            } else {
                monthlyPayment = loanAmount / numPayments;
            }

            const totalPayment = monthlyPayment * numPayments;
            const totalInterest = totalPayment - loanAmount;

            this.updateLoanResults({
                monthlyPayment,
                totalLoan: loanAmount,
                totalInterest,
                totalPayment,
                term: loanTerm
            });
        }
    }

    updateLoanResults(results) {
        const elements = {
            monthlyPayment: document.getElementById('monthlyPayment'),
            totalLoan: document.getElementById('totalLoan'),
            totalInterest: document.getElementById('totalInterest'),
            totalPayment: document.getElementById('totalPayment'),
            resultTerm: document.getElementById('resultTerm'),
            affordabilityProgress: document.getElementById('affordabilityProgress')
        };

        if (elements.monthlyPayment) {
            this.animateValue(elements.monthlyPayment, results.monthlyPayment, '€');
        }
        
        if (elements.totalLoan) {
            this.animateValue(elements.totalLoan, results.totalLoan, '€');
        }
        
        if (elements.totalInterest) {
            this.animateValue(elements.totalInterest, results.totalInterest, '€');
        }
        
        if (elements.totalPayment) {
            this.animateValue(elements.totalPayment, results.totalPayment, '€');
        }

        if (elements.resultTerm) {
            elements.resultTerm.textContent = results.term;
        }

        if (elements.affordabilityProgress) {
            const affordability = Math.min((results.monthlyPayment / 2000) * 100, 100);
            elements.affordabilityProgress.style.width = affordability + '%';
            
            if (affordability < 30) {
                elements.affordabilityProgress.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            } else if (affordability < 60) {
                elements.affordabilityProgress.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                elements.affordabilityProgress.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            }
        }
    }

    animateValue(element, targetValue, prefix = '') {
        const startValue = parseFloat(element.textContent.replace(/[€,]/g, '')) || 0;
        const duration = 800;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
            
            element.textContent = prefix + Math.round(currentValue).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    setupResultAnimations() {
        const resultElements = document.querySelectorAll('.result-card, .detail-item');
        
        resultElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-5px) scale(1.02)';
                element.style.boxShadow = '0 20px 40px rgba(0, 209, 178, 0.2)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });
        });
    }
}

// Inizializza l'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza l'app principale
    window.autoShopApp = new AutoShopApp();
    
    // Inizializza le animazioni GSAP se disponibili
    if (window.initGSAPAnimations) {
        window.initGSAPAnimations();
    }
    
    // Inizializza gli effetti tilt se disponibili
    if (window.initTiltEffects) {
        window.initTiltEffects();
    }
    
    // Inizializza le animazioni avanzate se disponibili
    if (window.AdvancedAnimations) {
        try {
            window.advancedAnimations = new window.AdvancedAnimations();
            console.log('🎬 Animazioni avanzate inizializzate con successo!');
        } catch (error) {
            console.warn('⚠️ Errore nell\'inizializzazione delle animazioni avanzate:', error);
        }
    }
    
    console.log('🚗 Wali Wheelse - App inizializzata con successo!');
});

// Utility functions globali
window.utils = {
    // Formatta prezzo
    formatPrice: (price) => CarUtils.formatPrice(price),
    
    // Formatta chilometri
    formatKm: (km) => CarUtils.formatKm(km),
    
    // Genera slug
    generateSlug: (title) => CarUtils.generateSlug(title),
    
    // Mostra toast
    showToast: (message, type) => {
        if (window.autoShopApp) {
            window.autoShopApp.showToast(message, type);
        }
    },
    
    // Naviga ai dettagli
    navigateToDetails: (slug) => {
        window.location.href = `dettagli-${slug}.html`;
    },
    
    // Aggiungi ai preferiti
    toggleFavorite: (carId) => {
        if (window.autoShopApp) {
            const favorites = window.autoShopApp.getFavorites();
            if (favorites.includes(carId)) {
                window.autoShopApp.removeFromFavorites(carId);
                return false;
            } else {
                window.autoShopApp.addToFavorites(carId);
                return true;
            }
        }
        return false;
    },
    
    // Aggiungi al confronto
    toggleCompare: (carId) => {
        if (window.autoShopApp) {
            const compareList = window.autoShopApp.getCompareList();
            if (compareList.includes(carId)) {
                window.autoShopApp.removeFromCompare(carId);
                return false;
            } else {
                return window.autoShopApp.addToCompare(carId);
            }
        }
        return false;
    },
    
    // Aggiungi al carrello
    addToCart: (carId) => {
        if (window.autoShopApp) {
            const btn = document.querySelector(`[data-car-id="${carId}"]`);
            if (btn) {
                window.autoShopApp.addToCart(btn);
            }
        }
    }
};

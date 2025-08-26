/**
 * Pagina Macchine - Wali Wheelse
 * Catalogo avanzato con filtri e funzionalità moderne
 */

class MacchinePage {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentFilters = {
            brand: '',
            priceRange: '',
            fuel: '',
            year: '',
            transmission: '',
            search: ''
        };
        this.currentPage = 1;
        this.carsPerPage = 12;
        this.init();
    }

    init() {
        console.log('🚀 Inizializzazione MacchinePage NUCLEARE');
        
        // Registra Service Worker
        this.registerServiceWorker();
        
        // Inizializza analytics
        this.initAnalytics();
        
        // Inizializza lazy loading
        this.initLazyLoading();
        
        // Inizializza ottimizzazioni performance
        this.initPerformanceOptimizations();
        
        // Inizializza accessibilità
        this.initAccessibility();
        
        // Inizializza filtri avanzati
        this.initAdvancedFilters();
        
        // Inizializza slider prezzo
        this.initPriceSlider();
        
        // Inizializza filtri multi-select
        this.initMultiSelectFilters();
        
        // Inizializza funzionalità di ricerca
        this.initSearchFunctionality();
        
        // Inizializza paginazione
        this.initPagination();
        
        // Inizializza confronto auto
        this.initCarComparison();
        
        // Inizializza preferiti
        this.initFavorites();
        
        // Inizializza animazioni
        this.initAnimations();
        
        // Controlla aggiornamenti dall'admin ogni 5 secondi
        this.startAdminSync();
        
        // Carica dati auto
        this.loadCarsData();
        
        // Binding eventi
        this.bindEvents();
        
        console.log('✅ MacchinePage NUCLEARE inizializzata completamente');
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registrato:', registration.scope);
                    
                    // Gestisci aggiornamenti
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nuovo Service Worker disponibile
                                this.showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('❌ Errore registrazione Service Worker:', error);
                });
        } else {
            console.log('⚠️ Service Worker non supportato');
        }
    }
    
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🔄 Nuovo aggiornamento disponibile!</span>
                <button onclick="location.reload()" class="update-btn">Aggiorna</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove dopo 10 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
    
    initAnalytics() {
        if (window.AnalyticsNucleare) {
            console.log('📊 Analytics NUCLEARE integrato');
            
            // Tracking specifico per la pagina macchine
            window.AnalyticsNucleare.sendEvent('page_view', {
                page: 'macchine',
                title: document.title,
                url: window.location.href
            });
            
            // Tracking per filtri
            document.querySelectorAll('.filter-input, .filter-select').forEach(filter => {
                filter.addEventListener('change', (e) => {
                    window.AnalyticsNucleare.sendEvent('filter_used', {
                        filter: e.target.name || e.target.id,
                        value: e.target.value
                    });
                });
            });
            
            // Tracking per visualizzazione auto
            this.trackCarViews();
        }
    }
    
    trackCarViews() {
        // Intersection Observer per tracking visualizzazioni auto
        if ('IntersectionObserver' in window) {
            const carObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const carCard = entry.target;
                        const carName = carCard.querySelector('.car-name')?.textContent;
                        const carBrand = carCard.querySelector('.car-brand')?.textContent;
                        
                        if (carName && carBrand) {
                            window.AnalyticsNucleare.sendEvent('car_viewed', {
                                car: `${carBrand} ${carName}`,
                                position: entry.boundingClientRect
                            });
                        }
                        
                        // Osserva solo una volta
                        carObserver.unobserve(carCard);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            // Osserva tutte le card auto
            document.querySelectorAll('.premium-car-card').forEach(card => {
                carObserver.observe(card);
            });
        }
    }

    initSearchFunctionality() {
        // Ricerca avanzata con debounce
        let searchTimeout;
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }
        
        this.updateResultsCount();
    }

    initPagination() {
        this.updatePagination();
    }

    initCarComparison() {
        // Inizializza il sistema di confronto
        console.log('Sistema di confronto inizializzato');
    }

    initFavorites() {
        // Inizializza il sistema dei preferiti
        console.log('Sistema dei preferiti inizializzato');
    }

    initAnimations() {
        // Inizializza le animazioni
        console.log('Animazioni inizializzate');
    }

    startAdminSync() {
        // Controlla se ci sono nuove auto dall'admin ogni 5 secondi
        setInterval(() => {
            this.checkAdminUpdates();
        }, 5000);
    }

    checkAdminUpdates() {
        const adminCars = localStorage.getItem('siteCars');
        console.log('Controllo aggiornamenti admin - siteCars:', adminCars);
        
        if (adminCars) {
            const newCars = JSON.parse(adminCars);
            const currentCount = this.cars.length;
            console.log('Conteggio auto attuali:', currentCount, 'Nuove auto dall\'admin:', newCars.length);
            
            if (newCars.length !== currentCount) {
                // Ci sono nuove auto o auto rimosse
                console.log('Aggiornamento rilevato! Aggiorno il catalogo...');
                this.cars = newCars;
                this.filteredCars = [...this.cars];
                this.renderCars();
                this.updatePagination();
                this.updateResultsCount();
                
                if (newCars.length > currentCount) {
                    this.showToast(`Nuove auto aggiunte dall'amministratore!`, 'success');
                } else {
                    this.showToast(`Catalogo aggiornato dall'amministratore`, 'info');
                }
            }
        }
    }

    refreshDataFromAdmin() {
        console.log('=== AGGIORNAMENTO MANUALE DATI ===');
        
        // Debug: mostra lo stato attuale
        this.debugCurrentState();
        
        // Ricarica i dati dall'admin
        this.loadCarsData();
        
        // Aggiorna i filtri
        this.initAdvancedFilters();
        
        // Re-renderizza tutto
        this.renderCars();
        this.updatePagination();
        this.updateResultsCount();
        
        this.showToast('Dati aggiornati dall\'amministratore!', 'success');
    }
    
    debugCurrentState() {
        console.log('=== STATO ATTUALE DEBUG ===');
        console.log('Auto caricate (this.cars):', this.cars);
        console.log('Auto filtrate (this.filteredCars):', this.filteredCars);
        console.log('localStorage.publishedCars:', localStorage.getItem('publishedCars'));
        console.log('localStorage.siteCars:', localStorage.getItem('siteCars'));
        console.log('Contatore auto visualizzate:', this.cars.length);
    }
    
    quickTest() {
        console.log('🧪 TEST RAPIDO SINCRONIZZAZIONE');
        
        // Test 1: Verifica localStorage
        const siteCars = localStorage.getItem('siteCars');
        console.log('1. siteCars presente:', !!siteCars);
        
        if (siteCars) {
            try {
                const cars = JSON.parse(siteCars);
                console.log('2. Parsing JSON OK:', cars.length, 'auto');
                
                // Test 3: Verifica struttura
                if (cars.length > 0) {
                    const firstCar = cars[0];
                    const requiredFields = ['id', 'name', 'brand', 'price', 'status'];
                    const missingFields = requiredFields.filter(field => !firstCar.hasOwnProperty(field));
                    
                    if (missingFields.length === 0) {
                        console.log('3. ✅ Struttura dati OK');
                    } else {
                        console.log('3. ❌ Campi mancanti:', missingFields);
                    }
                }
            } catch (e) {
                console.log('2. ❌ Errore parsing JSON:', e.message);
            }
        }
        
        // Test 4: Verifica stato interno
        console.log('4. Stato interno:');
        console.log('   - this.cars:', this.cars.length);
        console.log('   - this.filteredCars:', this.filteredCars.length);
        
        // Test 5: Forza sincronizzazione se necessario
        if (this.cars.length === 0 && siteCars) {
            console.log('5. 🔄 Forzo sincronizzazione...');
            this.loadCarsData();
        }
    }

    bindEvents() {
        // Filtri avanzati
        const brandFilter = document.getElementById('brandFilter');
        const yearFilter = document.getElementById('yearFilter');
        const transmissionFilter = document.getElementById('transmissionFilter');
        const fuelFilter = document.getElementById('fuelFilter');
        const priceSlider = document.getElementById('priceSlider');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const viewToggle = document.getElementById('viewToggle');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const applyFiltersBtn = document.getElementById('applyFilters');

        // Event listeners per i filtri
        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                this.currentFilters.brand = e.target.value;
                this.applyFilters();
            });
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.currentFilters.year = e.target.value;
                this.applyFilters();
            });
        }

        if (transmissionFilter) {
            transmissionFilter.addEventListener('change', (e) => {
                this.currentFilters.transmission = e.target.value;
                this.applyFilters();
            });
        }

        if (fuelFilter) {
            fuelFilter.addEventListener('change', (e) => {
                this.currentFilters.fuel = e.target.value;
                this.applyFilters();
            });
        }

        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        // Ricerca
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Ordinamento
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCars(e.target.value);
            });
        }

        // Toggle visualizzazione
        if (viewToggle) {
            viewToggle.addEventListener('click', () => {
                this.toggleView();
            });
        }

        // Reset filtri
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Applica filtri
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Aggiorna dati
        const refreshDataBtn = document.getElementById('refreshData');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => {
                this.refreshDataFromAdmin();
            });
        }

        // Debug dati
        const debugDataBtn = document.getElementById('debugData');
        if (debugDataBtn) {
            debugDataBtn.addEventListener('click', () => {
                this.debugCurrentState();
            });
        }

        // Chiusura modal
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideCarDetailsModal();
            });
        }

        // Chiusura modal cliccando fuori
        const modal = document.getElementById('carDetailsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCarDetailsModal();
                }
            });
        }

        // Paginazione
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            }
        });

        // Ordinamento
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCars(e.target.value);
            });
        }

        // Visualizzazione griglia/lista
        const viewToggle = document.getElementById('viewToggle');
        if (viewToggle) {
            viewToggle.addEventListener('click', () => {
                this.toggleView();
            });
        }
    }

    loadCarsData() {
        console.log('=== CARICAMENTO DATI AUTO ===');
        
        // Prova a caricare auto pubblicate dall'admin
        const adminCars = localStorage.getItem('siteCars');
        console.log('Contenuto di siteCars in localStorage:', adminCars);
        
        if (adminCars) {
            try {
                // Carica auto dall'admin
                this.cars = JSON.parse(adminCars);
                console.log('✅ Auto caricate dall\'admin:', this.cars.length);
                console.log('Dettagli auto caricate:', this.cars);
                
                // Verifica che le auto abbiano tutti i campi necessari
                this.cars.forEach((car, index) => {
                    console.log(`Auto ${index + 1}:`, {
                        id: car.id,
                        name: car.name,
                        brand: car.brand,
                        status: car.status,
                        price: car.price
                    });
                });
            } catch (error) {
                console.error('❌ Errore nel parsing delle auto dall\'admin:', error);
                this.loadExampleData();
            }
        } else {
            console.log('⚠️ Nessuna auto trovata in siteCars, carico dati di esempio');
            this.loadExampleData();
        }
        
        // Inizializza filteredCars
        this.filteredCars = [...this.cars];
        console.log('✅ Filtered cars inizializzate:', this.filteredCars.length);
        
        // Forza il rendering immediato
        setTimeout(() => {
            this.renderCars();
            this.updateResultsCount();
            console.log('🔄 Rendering forzato completato');
        }, 100);
    }
    
    loadExampleData() {
        console.log('Caricamento dati di esempio...');
        // Dati di esempio se non ci sono auto dall'admin
        this.cars = [
                {
                    id: 1,
                    name: 'BMW X5 xDrive40i',
                    brand: 'BMW',
                    model: 'X5',
                    year: 2024,
                    price: 85000,
                    fuel: 'benzina',
                    transmission: 'automatico',
                    power: 340,
                    mileage: 15000,
                    color: 'Alpine White',
                    description: 'SUV di lusso con prestazioni eccezionali e comfort superiore',
                    features: ['Navigazione', 'Cruise Control', 'Sedili Riscaldati', 'Sistema Audio Premium'],
                    images: [
                        'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5+1',
                        'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5+2',
                        'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5+3'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5',
                    status: 'available',
                    location: 'Milano',
                    dealer: 'BMW Milano Centro'
                },
                {
                    id: 2,
                    name: 'Mercedes-Benz C200 AMG',
                    brand: 'Mercedes',
                    model: 'C200',
                    year: 2023,
                    price: 52000,
                    fuel: 'benzina',
                    transmission: 'automatico',
                    power: 204,
                    mileage: 25000,
                    color: 'Obsidian Black',
                    description: 'Berlina elegante con finiture AMG e tecnologia all\'avanguardia',
                    features: ['AMG Package', 'LED Intelligent Light', 'MBUX', 'Sensori di Parcheggio'],
                    images: [
                        'https://via.placeholder.com/400x300/10b981/ffffff?text=MERC+C200+1',
                        'https://via.placeholder.com/400x300/10b981/ffffff?text=MERC+C200+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/10b981/ffffff?text=MERC+C200',
                    status: 'available',
                    location: 'Roma',
                    dealer: 'Mercedes Roma'
                },
                {
                    id: 3,
                    name: 'Audi A4 2.0 TDI',
                    brand: 'Audi',
                    model: 'A4',
                    year: 2023,
                    price: 45000,
                    fuel: 'diesel',
                    transmission: 'automatico',
                    power: 150,
                    mileage: 30000,
                    color: 'Daytona Grey',
                    description: 'Berlina sportiva con motore diesel efficiente e design moderno',
                    features: ['Virtual Cockpit', 'MMI Navigation', 'Audi Pre Sense', 'Sistema Audio Bose'],
                    images: [
                        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4+1',
                        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4',
                    status: 'available',
                    location: 'Torino',
                    dealer: 'Audi Torino Centro'
                },
                {
                    id: 4,
                    name: 'Porsche 911 Carrera',
                    brand: 'Porsche',
                    model: '911',
                    year: 2024,
                    price: 125000,
                    fuel: 'benzina',
                    transmission: 'manuale',
                    power: 450,
                    mileage: 5000,
                    color: 'GT Silver Metallic',
                    description: 'Icona dello sport automobilistico con prestazioni leggendarie',
                    features: ['Sport Chrono Package', 'PASM', 'Porsche Communication Management', 'Sistema Audio Burmester'],
                    images: [
                        'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911+1',
                        'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911',
                    status: 'available',
                    location: 'Milano',
                    dealer: 'Porsche Milano'
                },
                {
                    id: 5,
                    name: 'Ferrari F8 Tributo',
                    brand: 'Ferrari',
                    model: 'F8',
                    year: 2023,
                    price: 280000,
                    fuel: 'benzina',
                    transmission: 'automatico',
                    power: 710,
                    mileage: 8000,
                    color: 'Rosso Corsa',
                    description: 'Supercar italiana con design aggressivo e prestazioni da brivido',
                    features: ['Ferrari Dynamic Enhancer', 'E-Diff3', 'Suspension Magnetorheological', 'Carbon Fiber Interior'],
                    images: [
                        'https://via.placeholder.com/400x300/dc2626/ffffff?text=FERRARI+F8+1',
                        'https://via.placeholder.com/400x300/dc2626/ffffff?text=FERRARI+F8+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=FERRARI+F8',
                    status: 'available',
                    location: 'Maranello',
                    dealer: 'Ferrari Official'
                },
                {
                    id: 6,
                    name: 'Lamborghini Huracán',
                    brand: 'Lamborghini',
                    model: 'Huracán',
                    year: 2024,
                    price: 320000,
                    fuel: 'benzina',
                    transmission: 'automatico',
                    power: 640,
                    mileage: 3000,
                    color: 'Verde Mantis',
                    description: 'V10 naturale aspirato con design iconico e prestazioni estreme',
                    features: ['Lamborghini Dynamic Steering', 'Magnetic Ride Control', 'Carbon Ceramic Brakes', 'Lifting System'],
                    images: [
                        'https://via.placeholder.com/400x300/059669/ffffff?text=LAMBO+HU+1',
                        'https://via.placeholder.com/400x300/059669/ffffff?text=LAMBO+HU+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/059669/ffffff?text=LAMBO+HU',
                    status: 'available',
                    location: 'Sant\'Agata',
                    dealer: 'Lamborghini Official'
                }
            ];
        }

        this.filteredCars = [...this.cars];
        this.renderCars();
        
        // Mostra messaggio di sincronizzazione
        if (adminCars) {
            this.showToast(`Caricate ${this.cars.length} auto dal catalogo amministratore!`, 'success');
        }
        
        // Inizializza i filtri dopo aver caricato i dati
        this.filteredCars = [...this.cars];
        this.updateResultsCount();
    }

    initAdvancedFilters() {
        // Popola i filtri con i dati disponibili
        this.populateFilterOptions();
        
        // Slider prezzo
        this.initPriceSlider();
        
        // Filtri multipli
        this.initMultiSelectFilters();
        
        // Inizializza i filtri con i dati correnti
        this.filteredCars = [...this.cars];
        this.updateResultsCount();
    }

    populateFilterOptions() {
        // Marche
        const brands = [...new Set(this.cars.map(car => car.brand))];
        const brandFilter = document.getElementById('brandFilter');
        if (brandFilter) {
            brandFilter.innerHTML = '<option value="">Tutte le marche</option>' +
                brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
        }

        // Carburanti
        const fuels = [...new Set(this.cars.map(car => car.fuel))];
        const fuelFilter = document.getElementById('fuelFilter');
        if (fuelFilter) {
            fuelFilter.innerHTML = '<option value="">Tutti i carburanti</option>' +
                fuels.map(fuel => `<option value="${fuel}">${this.capitalizeFirst(fuel)}</option>`).join('');
        }

        // Anni
        const years = [...new Set(this.cars.map(car => car.year))].sort((a, b) => b - a);
        const yearFilter = document.getElementById('yearFilter');
        if (yearFilter) {
            yearFilter.innerHTML = '<option value="">Tutti gli anni</option>' +
                years.map(year => `<option value="${year}">${year}</option>`).join('');
        }

        // Trasmissioni
        const transmissions = [...new Set(this.cars.map(car => car.transmission))];
        const transmissionFilter = document.getElementById('transmissionFilter');
        if (transmissionFilter) {
            transmissionFilter.innerHTML = '<option value="">Tutte le trasmissioni</option>' +
                transmissions.map(trans => `<option value="${trans}">${this.capitalizeFirst(trans)}</option>`).join('');
        }
    }

    initPriceSlider() {
        const priceSlider = document.getElementById('priceSlider');
        const priceValue = document.getElementById('priceValue');
        
        if (priceSlider && priceValue) {
            const maxPrice = Math.max(...this.cars.map(car => car.price));
            priceSlider.max = maxPrice;
            priceSlider.value = maxPrice;
            priceValue.textContent = `€${maxPrice.toLocaleString()}`;
            
            // Imposta il valore iniziale del filtro
            this.currentFilters.priceRange = maxPrice;
            
            priceSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                priceValue.textContent = `€${parseInt(value).toLocaleString()}`;
                this.currentFilters.priceRange = value;
                this.applyFilters();
            });
        }
    }

    initMultiSelectFilters() {
        // Filtri per caratteristiche
        const featuresFilter = document.getElementById('featuresFilter');
        if (featuresFilter) {
            const allFeatures = [...new Set(this.cars.flatMap(car => car.features))];
            featuresFilter.innerHTML = allFeatures.map(feature => 
                `<label class="checkbox-item">
                    <input type="checkbox" value="${feature}">
                    <span>${feature}</span>
                </label>`
            ).join('');
            
            // Event listener per i checkbox
            featuresFilter.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.applyFilters();
                }
            });
        }
    }

    initSearchFunctionality() {
        // Ricerca avanzata con debounce
        let searchTimeout;
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }
    }

    applyFilters() {
        this.filteredCars = this.cars.filter(car => {
            // Filtro marca
            if (this.currentFilters.brand && car.brand !== this.currentFilters.brand) return false;
            
            // Filtro prezzo
            if (this.currentFilters.priceRange && car.price > parseInt(this.currentFilters.priceRange)) return false;
            
            // Filtro carburante
            if (this.currentFilters.fuel && car.fuel !== this.currentFilters.fuel) return false;
            
            // Filtro anno
            if (this.currentFilters.year && car.year !== parseInt(this.currentFilters.year)) return false;
            
            // Filtro trasmissione
            if (this.currentFilters.transmission && car.transmission !== this.currentFilters.transmission) return false;
            
            // Filtro ricerca testuale
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = `${car.name} ${car.brand} ${car.model} ${car.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }
            
            // Filtro caratteristiche
            const selectedFeatures = Array.from(document.querySelectorAll('#featuresFilter input:checked')).map(cb => cb.value);
            if (selectedFeatures.length > 0) {
                const hasAllFeatures = selectedFeatures.every(feature => car.features.includes(feature));
                if (!hasAllFeatures) return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderCars();
        this.updatePagination();
        this.updateResultsCount();
    }

    addCardEventListeners() {
        // Hover effects e animazioni per le card
        document.querySelectorAll('.premium-car-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
        
        this.updateResultsCount();
    }

    goToPage(page) {
        if (page >= 1 && page <= Math.ceil(this.filteredCars.length / this.carsPerPage)) {
            this.currentPage = page;
            this.renderCars();
            this.updatePagination();
            this.updateResultsCount();
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const count = this.filteredCars.length;
            const total = this.cars.length;
            if (count === total) {
                resultsCount.textContent = `${count} auto disponibili`;
            } else {
                resultsCount.textContent = `${count} di ${total} auto trovate`;
            }
        }
    }

    renderCars() {
        const carsContainer = document.getElementById('premiumCarsGrid');
        if (!carsContainer) {
            console.error('Container premiumCarsGrid non trovato!');
            return;
        }
        
        console.log('Rendering auto:', this.filteredCars.length);
        
        if (this.filteredCars.length === 0) {
            carsContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🚗</div>
                    <h3 style="color: var(--color-text-muted); margin-bottom: 10px;">Nessuna auto trovata</h3>
                    <p style="color: var(--color-text-muted);">Prova a modificare i filtri di ricerca</p>
                    <button onclick="macchinePage.resetFilters()" class="glass-button primary ultra-modern" style="margin-top: 20px;">
                        Reset Filtri
                    </button>
                </div>
            `;
            return;
        }
        
        carsContainer.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        
        // Aggiungi event listeners alle card
        this.addCardEventListeners();
        
        console.log('Auto renderizzate:', this.filteredCars.length);
    }

    createCarCard(car) {
        const isFavorite = this.isFavorite(car.id);
        const isInComparison = this.isInComparison(car.id);
        
        return `
            <div class="premium-car-card" data-car-id="${car.id}">
                <div class="card-image-container">
                    <img src="${car.mainImage}" alt="${car.name}" class="car-image">
                    <div class="card-overlay">
                        <div class="card-actions">
                            <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                                    onclick="macchinePage.toggleFavorite(${car.id})" 
                                    title="${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                            <button class="action-btn compare-btn ${isInComparison ? 'active' : ''}" 
                                    onclick="macchinePage.toggleComparison(${car.id})" 
                                    title="${isInComparison ? 'Rimuovi dal confronto' : 'Aggiungi al confronto'}">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 3l-1.46 1.46L12 8.83l4.46-4.37L15 3H9zM3 9v1h2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8h2V9H3z"/>
                                </svg>
                            </button>
                            <button class="action-btn view-btn" 
                                    onclick="macchinePage.showCarDetails(${car.id})" 
                                    title="Visualizza dettagli">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-badge ${car.status === 'available' ? 'available' : 'sold'}">
                        ${car.status === 'available' ? 'Disponibile' : 'Venduta'}
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="car-name">${car.name}</h3>
                        <div class="car-brand">${car.brand}</div>
                    </div>
                    
                    <div class="car-specs">
                        <div class="spec-item">
                            <span class="spec-label">Anno:</span>
                            <span class="spec-value">${car.year}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Potenza:</span>
                            <span class="spec-value">${car.power} CV</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Carburante:</span>
                            <span class="spec-value">${this.capitalizeFirst(car.fuel)}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Km:</span>
                            <span class="spec-value">${car.mileage.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="car-location">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>${car.location}</span>
                    </div>
                    
                    <div class="card-footer">
                        <div class="car-price">€${car.price.toLocaleString()}</div>
                        <button class="btn-primary" onclick="macchinePage.showCarDetails(${car.id})">
                            Visualizza Dettagli
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addCardEventListeners() {
        // Hover effects e animazioni
        document.querySelectorAll('.premium-car-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    initPagination() {
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredCars.length / this.carsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Pulsante precedente
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">← Precedente</button>`;
        }
        
        // Numeri delle pagine
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // Pulsante successivo
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Successivo →</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCars();
        this.updatePagination();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const total = this.filteredCars.length;
            const start = (this.currentPage - 1) * this.carsPerPage + 1;
            const end = Math.min(this.currentPage * this.carsPerPage, total);
            
            resultsCount.textContent = `Mostrando ${start}-${end} di ${total} auto`;
        }
    }

    initCarComparison() {
        // Inizializza il sistema di confronto
        this.comparisonList = JSON.parse(sessionStorage.getItem('carComparison') || '[]');
        this.updateComparisonBadge();
    }

    toggleComparison(carId) {
        const index = this.comparisonList.indexOf(carId);
        
        if (index > -1) {
            this.comparisonList.splice(index, 1);
            this.showToast('Auto rimossa dal confronto', 'info');
        } else {
            if (this.comparisonList.length >= 3) {
                this.showToast('Puoi confrontare massimo 3 auto', 'warning');
                return;
            }
            this.comparisonList.push(carId);
            this.showToast('Auto aggiunta al confronto', 'success');
        }
        
        sessionStorage.setItem('carComparison', JSON.stringify(this.comparisonList));
        this.updateComparisonBadge();
        this.renderCars(); // Aggiorna le icone
    }

    isInComparison(carId) {
        return this.comparisonList.includes(carId);
    }

    updateComparisonBadge() {
        const badge = document.getElementById('comparisonBadge');
        if (badge) {
            badge.textContent = this.comparisonList.length;
            badge.style.display = this.comparisonList.length > 0 ? 'block' : 'none';
        }
    }

    initFavorites() {
        // Inizializza i preferiti
        this.favorites = JSON.parse(localStorage.getItem('carFavorites') || '[]');
    }

    toggleFavorite(carId) {
        const index = this.favorites.indexOf(carId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Auto rimossa dai preferiti', 'info');
        } else {
            this.favorites.push(carId);
            this.showToast('Auto aggiunta ai preferiti', 'success');
        }
        
        localStorage.setItem('carFavorites', JSON.stringify(this.favorites));
        this.renderCars(); // Aggiorna le icone
    }

    isFavorite(carId) {
        return this.favorites.includes(carId);
    }

    sortCars(sortBy) {
        switch (sortBy) {
            case 'price-asc':
                this.filteredCars.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredCars.sort((a, b) => b.price - a.price);
                break;
            case 'year-desc':
                this.filteredCars.sort((a, b) => b.year - a.year);
                break;
            case 'power-desc':
                this.filteredCars.sort((a, b) => b.power - a.power);
                break;
            case 'mileage-asc':
                this.filteredCars.sort((a, b) => a.mileage - b.mileage);
                break;
            default:
                // Ordine predefinito (ID)
                this.filteredCars.sort((a, b) => a.id - b.id);
        }
        
        this.currentPage = 1;
        this.renderCars();
        this.updatePagination();
    }

    toggleView() {
        const carsContainer = document.getElementById('carsGrid');
        const viewToggle = document.getElementById('viewToggle');
        
        if (carsContainer.classList.contains('grid-view')) {
            carsContainer.classList.remove('grid-view');
            carsContainer.classList.add('list-view');
            viewToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>';
        } else {
            carsContainer.classList.remove('list-view');
            carsContainer.classList.add('grid-view');
            viewToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/></svg>';
        }
    }

    showCarDetails(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        // Crea e mostra il modal con i dettagli dell'auto
        this.createCarDetailsModal(car);
    }

    createCarDetailsModal(car) {
        const modal = document.createElement('div');
        modal.className = 'car-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${car.name}</h2>
                        <button class="modal-close" onclick="this.closest('.car-details-modal').remove()">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="car-gallery">
                            <div class="main-image">
                                <img src="${car.mainImage}" alt="${car.name}">
                            </div>
                            <div class="thumbnail-images">
                                ${car.images.map(img => `
                                    <img src="${img}" alt="${car.name}" onclick="this.parentElement.previousElementSibling.querySelector('img').src='${img}'">
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="car-info">
                            <div class="car-price-large">€${car.price.toLocaleString()}</div>
                            
                            <div class="car-specs-detailed">
                                <div class="spec-row">
                                    <span class="spec-label">Marca:</span>
                                    <span class="spec-value">${car.brand}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Modello:</span>
                                    <span class="spec-value">${car.model}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Anno:</span>
                                    <span class="spec-value">${car.year}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Potenza:</span>
                                    <span class="spec-value">${car.power} CV</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Carburante:</span>
                                    <span class="spec-value">${this.capitalizeFirst(car.fuel)}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Trasmissione:</span>
                                    <span class="spec-value">${this.capitalizeFirst(car.transmission)}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Chilometraggio:</span>
                                    <span class="spec-value">${car.mileage.toLocaleString()} km</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Colore:</span>
                                    <span class="spec-value">${car.color}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Località:</span>
                                    <span class="spec-value">${car.location}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Concessionario:</span>
                                    <span class="spec-value">${car.dealer}</span>
                                </div>
                            </div>
                            
                            <div class="car-description">
                                <h4>Descrizione</h4>
                                <p>${car.description}</p>
                            </div>
                            
                            <div class="car-features">
                                <h4>Caratteristiche</h4>
                                <div class="features-grid">
                                    ${car.features.map(feature => `
                                        <span class="feature-tag">${feature}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="car-actions">
                                <button class="btn-primary" onclick="macchinePage.contactDealer(${car.id})">
                                    Contatta Concessionario
                                </button>
                                <button class="btn-secondary" onclick="macchinePage.scheduleTestDrive(${car.id})">
                                    Prenota Test Drive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Anima l'apertura
        setTimeout(() => modal.classList.add('active'), 10);
    }

    contactDealer(carId) {
        this.showToast('Funzionalità contatto concessionario in sviluppo', 'info');
    }

    scheduleTestDrive(carId) {
        this.showToast('Funzionalità prenotazione test drive in sviluppo', 'info');
    }

    initAnimations() {
        // Animazioni di entrata per le card
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.premium-car-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#667eea'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Inizializza la pagina quando è caricata
document.addEventListener('DOMContentLoaded', () => {
    window.macchinePage = new MacchinePage();
});

// Gestione responsive
window.addEventListener('resize', () => {
    if (window.macchinePage) {
        macchinePage.updatePagination();
    }
});

/**
 * Car Explorer - Sistema di gestione auto con design glassmorphism
 * Versione 4.0 - SOLO auto dall'admin panel + Galleria Immagini
 * Mostra esclusivamente le auto aggiunte tramite il pannello di amministrazione
 */

class CarExplorer {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentPage = 1;
        this.carsPerPage = 6;
        this.currentCarImages = [];
        this.currentImageIndex = 0;
        this.filters = {
            brand: '',
            price: '',
            year: '',
            type: ''
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 CarExplorer inizializzato');
        this.loadCarsFromAdmin();
        this.bindEvents();
        this.renderCars();
        this.animateStats();
        this.initializeParallax();
        this.initializeScrollAnimations();
    }
    
    loadCarsFromAdmin() {
        // Carica SOLO auto dall'admin panel (localStorage)
        const savedCars = this.loadCarsFromStorage();
        
        // Mostra solo le auto aggiunte dall'admin
        this.cars = savedCars;
        this.filteredCars = [...this.cars];
        console.log('📊 Auto caricate:', this.cars.length);
    }

    loadCarsFromStorage() {
        try {
            const storedCars = localStorage.getItem('waliwheels_cars');
            if (storedCars) {
                const cars = JSON.parse(storedCars);
                // Filtra solo le auto attive per la visualizzazione pubblica
                return cars.filter(car => car.status === 'active');
            }
        } catch (e) {
            console.error('Errore nel caricamento auto da localStorage:', e);
        }
        return [];
    }
    
    bindEvents() {
        // Filtri
        const filterInputs = ['brandFilter', 'priceFilter', 'yearFilter', 'typeFilter'];
        filterInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
        
        // Animazioni al scroll
        this.initializeScrollAnimations();
        
        // Ricarica auto quando cambia localStorage (admin panel)
        window.addEventListener('storage', (e) => {
            if (e.key === 'waliwheels_cars') {
                this.loadCarsFromAdmin();
                this.renderCars();
                this.showToast('Catalogo aggiornato! 🚗', 'info');
            }
        });
    }
    
    initializeParallax() {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxLayers.forEach(layer => {
                const speed = layer.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Osserva tutti gli elementi con preserve-3d
        document.querySelectorAll('.preserve-3d').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    applyFilters() {
        this.filters = {
            brand: document.getElementById('brandFilter')?.value || '',
            price: document.getElementById('priceFilter')?.value || '',
            year: document.getElementById('yearFilter')?.value || '',
            type: document.getElementById('typeFilter')?.value || ''
        };
        
        this.filteredCars = this.cars.filter(car => {
            let matches = true;
            
            if (this.filters.brand && car.brand.toLowerCase() !== this.filters.brand.toLowerCase()) {
                matches = false;
            }
            
            if (this.filters.type && car.type !== this.filters.type) {
                matches = false;
            }
            
            if (this.filters.year && car.year !== parseInt(this.filters.year)) {
                matches = false;
            }
            
            if (this.filters.price) {
                const [min, max] = this.filters.price.split('-').map(p => p === '+' ? Infinity : parseInt(p));
                if (car.price < min || (max !== Infinity && car.price > max)) {
                    matches = false;
                }
            }
            
            return matches;
        });
        
        this.currentPage = 1;
        this.renderCars();
        this.showToast(`${this.filteredCars.length} auto trovate`, 'info');
    }
    
    clearFilters() {
        if (document.getElementById('brandFilter')) document.getElementById('brandFilter').value = '';
        if (document.getElementById('priceFilter')) document.getElementById('priceFilter').value = '';
        if (document.getElementById('yearFilter')) document.getElementById('yearFilter').value = '';
        if (document.getElementById('typeFilter')) document.getElementById('typeFilter').value = '';
        
        this.filters = { brand: '', price: '', year: '', type: '' };
        this.filteredCars = [...this.cars];
        this.currentPage = 1;
        this.renderCars();
        this.showToast('Filtri cancellati', 'info');
    }
    
    renderCars() {
        const carsGrid = document.getElementById('carsGrid');
        if (!carsGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.carsPerPage;
        const endIndex = startIndex + this.carsPerPage;
        const carsToShow = this.filteredCars.slice(startIndex, endIndex);
        
        if (this.filteredCars.length === 0) {
            carsGrid.innerHTML = `
                <div class="no-cars-found">
                    <h3>🚗 Nessuna auto trovata</h3>
                    <p>Non ci sono auto che corrispondono ai filtri selezionati. Prova a modificare i criteri di ricerca.</p>
                    <p class="admin-note">💡 <strong>Nota:</strong> Le auto vengono aggiunte tramite il pannello di amministrazione.</p>
                </div>
            `;
        } else {
            carsGrid.innerHTML = carsToShow.map(car => this.createCarCard(car)).join('');
        }
        
        this.updateCarsCount();
        this.updateLoadMoreButton();
    }
    
    createCarCard(car) {
        const typeIcon = this.getCarIcon(car.type);
        const typeLabel = this.getTypeLabel(car.type);
        const fuelLabel = this.getFuelLabel(car.fuel);
        
        return `
            <div class="car-card preserve-3d" data-car-id="${car.id}">
                <div class="car-image">
                    ${car.image ? `<img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">` : `<div class="car-placeholder">${typeIcon}</div>`}
                    ${car.featured ? '<div class="featured-badge">⭐ In Evidenza</div>' : ''}
                </div>
                <div class="car-content">
                    <div class="car-header">
                        <h3 class="car-title">${car.brand} ${car.model}</h3>
                        <div class="car-price">€${car.price.toLocaleString()}</div>
                    </div>
                    
                    <div class="car-details">
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>${car.year}</span>
                        </div>
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>${typeLabel}</span>
                        </div>
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>${fuelLabel}</span>
                        </div>
                        ${car.km > 0 ? `
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>${car.km.toLocaleString()} km</span>
                        </div>
                        ` : ''}
                        ${car.engine ? `
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>${car.engine}cc</span>
                        </div>
                        ` : ''}
                        ${car.power ? `
                        <div class="car-detail">
                            <svg class="car-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>${car.power} CV</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${car.description ? `<p class="car-description">${car.description}</p>` : ''}
                    
                    <div class="car-actions">
                        <button class="car-action-btn primary" onclick="viewCarDetails('${car.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            <span>Dettagli</span>
                        </button>
                        <button class="car-action-btn secondary" onclick="contactAboutCar('${car.id}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
                            </svg>
                            <span>Contatta</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCarIcon(type) {
        const icons = {
            suv: '🚙',
            berlina: '🚗',
            sportiva: '🏎️',
            elettrica: '⚡',
            ibrida: '🔋',
            cabrio: '🌞',
            'station-wagon': '📦'
        };
        return icons[type] || '🚗';
    }
    
    getTypeLabel(type) {
        const labels = {
            suv: 'SUV',
            berlina: 'Berlina',
            sportiva: 'Sportiva',
            elettrica: 'Elettrica',
            ibrida: 'Ibrida',
            cabrio: 'Cabrio',
            'station-wagon': 'Station Wagon'
        };
        return labels[type] || type;
    }
    
    getFuelLabel(fuel) {
        const labels = {
            benzina: 'Benzina',
            diesel: 'Diesel',
            elettrico: 'Elettrico',
            ibrido: 'Ibrido',
            gpl: 'GPL',
            metano: 'Metano'
        };
        return labels[fuel] || fuel;
    }
    
    updateCarsCount() {
        const carsCount = document.getElementById('carsCount');
        if (carsCount) {
            carsCount.textContent = this.filteredCars.length;
        }
        
        // Aggiorna anche gli stats del hero
        this.updateHeroStats();
    }

    updateHeroStats() {
        // Aggiorna il numero di auto negli stats
        const autoStats = document.querySelectorAll('.stat-number');
        if (autoStats.length >= 2) {
            autoStats[0].textContent = this.cars.length; // Auto Premium
            autoStats[1].textContent = this.getUniqueBrands().length; // Marche
        }
    }

    getUniqueBrands() {
        const brands = new Set();
        this.cars.forEach(car => {
            if (car.brand) brands.add(car.brand);
        });
        return Array.from(brands);
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.load-more');
        if (loadMoreBtn) {
            const hasMoreCars = this.currentPage * this.carsPerPage < this.filteredCars.length;
            loadMoreBtn.style.display = hasMoreCars ? 'block' : 'none';
        }
    }
    
    viewCarDetails(carId) {
        console.log('🔍 viewCarDetails chiamata con ID:', carId);
        const car = this.cars.find(c => c.id === carId);
        console.log('🚗 Auto trovata:', car);
        if (car) {
            console.log('✅ Apro il modal per:', car.brand, car.model);
            this.openCarDetailsModal(car);
        } else {
            console.error('❌ Auto non trovata con ID:', carId);
        }
    }

    openCarDetailsModal(car) {
        console.log('🚀 openCarDetailsModal chiamata per:', car.brand, car.model);
        
        // Prepara le immagini per la galleria
        this.currentCarImages = car.images && car.images.length >= 5 ? car.images : [
            car.image || 'https://via.placeholder.com/800x600/1a1a1a/00ff88?text=Immagine+Principale',
            'https://via.placeholder.com/800x600/1a1a1a/00cc6a?text=Vista+Laterale',
            'https://via.placeholder.com/800x600/1a1a1a/ff6b35?text=Interno',
            'https://via.placeholder.com/800x600/1a1a1a/f7931e?text=Motore',
            'https://via.placeholder.com/800x600/1a1a1a/00ff88?text=Retro'
        ];
        
        this.currentImageIndex = 0;
        
        // Popola il modal con i dettagli dell'auto
        const imageElement = document.getElementById('detailCarImage');
        const titleElement = document.getElementById('detailCarTitle');
        const priceElement = document.getElementById('detailCarPrice');
        
        console.log('🔍 Elementi del modal trovati:', {
            image: imageElement,
            title: titleElement,
            price: priceElement
        });
        
        if (imageElement) imageElement.src = this.currentCarImages[0];
        if (titleElement) titleElement.textContent = `${car.brand} ${car.model}`;
        if (priceElement) priceElement.textContent = `€${car.price.toLocaleString()}`;
        
        document.getElementById('detailCarYear').textContent = car.year || 'N/A';
        document.getElementById('detailCarType').textContent = this.getTypeLabel(car.type) || 'N/A';
        document.getElementById('detailCarColor').textContent = car.color || 'N/A';
        document.getElementById('detailCarFuel').textContent = this.getFuelLabel(car.fuel) || 'N/A';
        document.getElementById('detailCarKm').textContent = car.km ? `${car.km.toLocaleString()} km` : 'N/A';
        document.getElementById('detailCarEngine').textContent = car.engine ? `${car.engine}cc` : 'N/A';
        document.getElementById('detailCarPower').textContent = car.power ? `${car.power} CV` : 'N/A';
        document.getElementById('detailCarTransmission').textContent = car.transmission || 'N/A';
        document.getElementById('detailCarDoors').textContent = car.doors || 'N/A';
        document.getElementById('detailCarSeats').textContent = car.seats || 'N/A';
        document.getElementById('detailCarDescription').textContent = car.description || 'Nessuna descrizione disponibile.';

        // Aggiorna la galleria
        this.updateGallery();

        // Mostra il modal
        const modal = document.getElementById('carDetailsModal');
        console.log('🔍 Modal trovato:', modal);
        
        if (modal) {
            console.log('✅ Modal trovato, lo apro...');
            modal.style.display = 'flex';
            modal.classList.add('active');
            console.log('✅ Modal aperto!');
        } else {
            console.error('❌ Modal non trovato!');
        }
        
        this.showToast(`Visualizzando ${car.brand} ${car.model}`, 'info');
    }

    updateGallery() {
        // Aggiorna immagine principale
        const mainImage = document.getElementById('detailCarImage');
        if (mainImage && this.currentCarImages.length > 0) {
            mainImage.src = this.currentCarImages[this.currentImageIndex];
        }

        // Aggiorna miniature
        const thumbnailContainer = document.getElementById('galleryThumbnails');
        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = this.currentCarImages.map((img, index) => `
                <div class="gallery-thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                     onclick="window.carExplorer.changeImage(${index})">
                    <img src="${img}" alt="Miniatura ${index + 1}" loading="lazy">
                </div>
            `).join('');
        }
    }

    changeImage(index) {
        if (index >= 0 && index < this.currentCarImages.length) {
            this.currentImageIndex = index;
            this.updateGallery();
        }
    }

    changeGalleryImage(direction) {
        const newIndex = this.currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentCarImages.length) {
            this.currentImageIndex = newIndex;
            this.updateGallery();
        }
    }
    
    contactAboutCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            this.showToast(`Contattaci per ${car.brand} ${car.model}`, 'info');
            // Qui puoi implementare la logica per aprire un form di contatto
        }
    }
    
    loadMoreCars() {
        this.currentPage++;
        this.renderCars();
        this.showToast('Altre auto caricate', 'info');
    }
    
    showToast(message, type = 'info') {
        // Implementazione del sistema di notifiche toast
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Se esiste un sistema di toast globale, usalo
        if (window.showToast) {
            window.showToast(message, type);
        }
    }
}

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM caricato, inizializzo CarExplorer...');
    window.carExplorer = new CarExplorer();
});

// Funzioni globali per i pulsanti HTML
function applyFilters() {
    if (window.carExplorer) {
        window.carExplorer.applyFilters();
    }
}

function clearFilters() {
    if (window.carExplorer) {
        window.carExplorer.clearFilters();
    }
}

function loadMoreCars() {
    if (window.carExplorer) {
        window.carExplorer.loadMoreCars();
    }
}

function viewCarDetails(carId) {
    console.log('🌐 Funzione globale viewCarDetails chiamata con ID:', carId);
    if (window.carExplorer) {
        window.carExplorer.viewCarDetails(carId);
    } else {
        console.error('❌ carExplorer non inizializzato!');
    }
}

function contactAboutCar(carId) {
    if (window.carExplorer) {
        window.carExplorer.contactAboutCar(carId);
    }
}

function closeCarDetailsModal() {
    console.log('🔒 Chiudo il modal...');
    const modal = document.getElementById('carDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        console.log('✅ Modal chiuso!');
    } else {
        console.error('❌ Modal non trovato per la chiusura!');
    }
}

function contactAboutCarFromModal() {
    // Chiudi il modal e mostra il toast
    closeCarDetailsModal();
    if (window.carExplorer) {
        window.carExplorer.showToast('Contattaci per maggiori informazioni! 📞', 'info');
    }
}

function changeGalleryImage(direction) {
    if (window.carExplorer) {
        window.carExplorer.changeGalleryImage(direction);
    }
}

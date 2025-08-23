// Car Detail Page JavaScript
class CarDetailPage {
    constructor() {
        this.currentCar = null;
        this.currentImageIndex = 0;
        this.carImages = [];
        this.init();
    }

    init() {
        this.loadCarData();
        this.setupEventListeners();
        this.setupTabs();
        this.setupFinancingCalculator();
        this.setupGallery();
    }

                loadCarData() {
                // Get car ID from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const carId = urlParams.get('id') || '1'; // Default to first car
                
                // Find car in database
                const dbCar = window.carsDatabase?.find(car => car.id === parseInt(carId));
                
                if (dbCar) {
                    // Mappa i campi del database ai campi della pagina di dettaglio
                    this.currentCar = {
                        id: dbCar.id,
                        nome: dbCar.titolo || `${dbCar.marca} ${dbCar.modello}`,
                        marca: dbCar.marca,
                        modello: dbCar.modello,
                        anno: dbCar.anno,
                        prezzo: dbCar.prezzo,
                        chilometraggio: dbCar.km || 0,
                        carburante: dbCar.alimentazione,
                        trasmissione: dbCar.cambio,
                        potenza: `${dbCar.potenza_cv} CV`,
                        cilindrata: dbCar.cilindrata || "N/A",
                        velocitaMax: dbCar.velocita_max || "N/A",
                        accelerazione: `${dbCar["0_100"]}s (0-100 km/h)`,
                        consumi: dbCar.consumi_l_100km ? `${dbCar.consumi_l_100km} L/100km` : "N/A",
                        emissioni: dbCar.emissioni_co2 ? `${dbCar.emissioni_co2} g/km CO2` : "0 g/km CO2",
                        lunghezza: dbCar.dimensioni?.lunghezza_mm ? `${dbCar.dimensioni.lunghezza_mm} mm` : "N/A",
                        larghezza: dbCar.dimensioni?.larghezza_mm ? `${dbCar.dimensioni.larghezza_mm} mm` : "N/A",
                        altezza: dbCar.dimensioni?.altezza_mm ? `${dbCar.dimensioni.altezza_mm} mm` : "N/A",
                        peso: dbCar.peso ? `${dbCar.peso} kg` : "N/A",
                        rating: 4.8,
                        dotazioni: dbCar.dotazioni || [],
                        immagini: dbCar.immagini || ["assets/images/cars/default.jpg"]
                    };
                } else {
                    this.currentCar = this.getDefaultCar();
                }
                
                if (this.currentCar) {
                    this.renderCarDetails();
                    this.setupCarImages();
                }
            }

                getDefaultCar() {
                // Mappa i campi del database ai campi della pagina di dettaglio
                const dbCar = window.carsDatabase?.[0];
                if (dbCar) {
                    return {
                        id: dbCar.id,
                        nome: dbCar.titolo || `${dbCar.marca} ${dbCar.modello}`,
                        marca: dbCar.marca,
                        modello: dbCar.modello,
                        anno: dbCar.anno,
                        prezzo: dbCar.prezzo,
                        chilometraggio: dbCar.km || 0,
                        carburante: dbCar.alimentazione,
                        trasmissione: dbCar.cambio,
                        potenza: `${dbCar.potenza_cv} CV`,
                        cilindrata: dbCar.cilindrata || "N/A",
                        velocitaMax: dbCar.velocita_max || "N/A",
                        accelerazione: `${dbCar["0_100"]}s (0-100 km/h)`,
                        consumi: dbCar.consumi_l_100km ? `${dbCar.consumi_l_100km} L/100km` : "N/A",
                        emissioni: dbCar.emissioni_co2 ? `${dbCar.emissioni_co2} g/km CO2` : "0 g/km CO2",
                        lunghezza: dbCar.dimensioni?.lunghezza_mm ? `${dbCar.dimensioni.lunghezza_mm} mm` : "N/A",
                        larghezza: dbCar.dimensioni?.larghezza_mm ? `${dbCar.dimensioni.larghezza_mm} mm` : "N/A",
                        altezza: dbCar.dimensioni?.altezza_mm ? `${dbCar.dimensioni.altezza_mm} mm` : "N/A",
                        peso: dbCar.peso ? `${dbCar.peso} kg` : "N/A",
                        rating: 4.8,
                        dotazioni: dbCar.dotazioni || [],
                        immagini: dbCar.immagini || ["assets/images/cars/default.jpg"]
                    };
                }
                
                // Fallback se non c'è database
                return {
                    id: 1,
                    nome: "Mercedes-Benz Classe S",
                    marca: "Mercedes-Benz",
                    modello: "Classe S",
                    anno: 2024,
                    prezzo: 150000,
                    chilometraggio: 0,
                    carburante: "Benzina",
                    trasmissione: "Automatica",
                    potenza: "530 CV",
                    cilindrata: "4.0L V8 Biturbo",
                    velocitaMax: "250 km/h",
                    accelerazione: "4.4s (0-100 km/h)",
                    consumi: "12.5 L/100km",
                    emissioni: "285 g/km CO2",
                    lunghezza: "5289 mm",
                    larghezza: "1921 mm",
                    altezza: "1503 mm",
                    peso: "2050 kg",
                    rating: 4.8,
                    dotazioni: [
                        "Sistema di assistenza alla guida",
                        "Display panoramico",
                        "Sedili riscaldati e ventilati",
                        "Sistema audio premium",
                        "Navigazione GPS",
                        "Telecamera di retromarcia",
                        "Sensori di parcheggio",
                        "LED Matrix",
                        "Tettuccio panoramico",
                        "Sistema di climatizzazione quadrizona"
                    ],
                    immagini: [
                        "assets/images/cars/mercedes-s-1.jpg",
                        "assets/images/cars/mercedes-s-2.jpg",
                        "assets/images/cars/mercedes-s-3.jpg",
                        "assets/images/cars/mercedes-s-4.jpg"
                    ]
                };
            }

    renderCarDetails() {
        if (!this.currentCar) return;

        // Update page title
        document.title = `${this.currentCar.nome} - Wali Wheelse`;
        
        // Update car title
        const carTitle = document.getElementById('carTitle');
        if (carTitle) carTitle.textContent = this.currentCar.nome;
        
        // Update price
        const carPrice = document.getElementById('carPrice');
        if (carPrice) carPrice.textContent = this.currentCar.prezzo.toLocaleString('it-IT');
        
        // Update monthly payment
        this.updateMonthlyPayment();
        
        // Update quick specs
        const carYear = document.getElementById('carYear');
        if (carYear) carYear.textContent = this.currentCar.anno;
        
        const carMileage = document.getElementById('carMileage');
        if (carMileage) carMileage.textContent = `${this.currentCar.chilometraggio.toLocaleString('it-IT')} km`;
        
        const carRating = document.getElementById('carRating');
        if (carRating) carRating.textContent = this.currentCar.rating;
        
        // Update badges
        this.updateBadges();
        
        // Render detailed specs
        this.renderDetailedSpecs();
        
        // Render features
        this.renderFeatures();
        
        // Render reviews
        this.renderReviews();
        
        // Render related cars
        this.renderRelatedCars();
    }

    updateBadges() {
        const badgeNew = document.getElementById('badgeNew');
        const badgeFeatured = document.getElementById('badgeFeatured');
        
        if (badgeNew) {
            badgeNew.style.display = this.currentCar.anno >= 2024 ? 'inline-block' : 'none';
        }
        
        if (badgeFeatured) {
            badgeFeatured.style.display = this.currentCar.rating >= 4.5 ? 'inline-block' : 'none';
        }
    }

    renderDetailedSpecs() {
        // Engine specs
        const engineSpecs = document.getElementById('engineSpecs');
        if (engineSpecs) {
            engineSpecs.innerHTML = `
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Potenza</span>
                    <span class="spec-value-detailed">${this.currentCar.potenza}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Cilindrata</span>
                    <span class="spec-value-detailed">${this.currentCar.cilindrata}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Velocità Massima</span>
                    <span class="spec-value-detailed">${this.currentCar.velocitaMax}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Accelerazione 0-100</span>
                    <span class="spec-value-detailed">${this.currentCar.accelerazione}</span>
                </div>
            `;
        }
        
        // Dimensions specs
        const dimensionsSpecs = document.getElementById('dimensionsSpecs');
        if (dimensionsSpecs) {
            dimensionsSpecs.innerHTML = `
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Lunghezza</span>
                    <span class="spec-value-detailed">${this.currentCar.lunghezza}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Larghezza</span>
                    <span class="spec-value-detailed">${this.currentCar.larghezza}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Altezza</span>
                    <span class="spec-value-detailed">${this.currentCar.altezza}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Peso</span>
                    <span class="spec-value-detailed">${this.currentCar.peso} kg</span>
                </div>
            `;
        }
        
        // Consumption specs
        const consumptionSpecs = document.getElementById('consumptionSpecs');
        if (consumptionSpecs) {
            consumptionSpecs.innerHTML = `
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Consumi Medi</span>
                    <span class="spec-value-detailed">${this.currentCar.consumi}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Emissioni CO2</span>
                    <span class="spec-value-detailed">${this.currentCar.emissioni}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Carburante</span>
                    <span class="spec-value-detailed">${this.currentCar.carburante}</span>
                </div>
                <div class="spec-item-detailed">
                    <span class="spec-label-detailed">Trasmissione</span>
                    <span class="spec-value-detailed">${this.currentCar.trasmissione}</span>
                </div>
            `;
        }
    }

    renderFeatures() {
        const featuresGrid = document.getElementById('featuresGrid');
        if (featuresGrid && this.currentCar.dotazioni) {
            featuresGrid.innerHTML = this.currentCar.dotazioni.map(feature => `
                <div class="feature-item">
                    <svg class="feature-icon" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span class="feature-text">${feature}</span>
                </div>
            `).join('');
        }
    }

    renderReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (reviewsList) {
            const reviews = [
                {
                    name: "Marco Rossi",
                    date: "2 giorni fa",
                    rating: 5,
                    text: "Auto fantastica! Prestazioni eccezionali e comfort di guida superiore. Consigliatissima!"
                },
                {
                    name: "Laura Bianchi",
                    date: "1 settimana fa",
                    rating: 5,
                    text: "Ho acquistato questa auto e sono rimasta molto soddisfatta. Design elegante e tecnologia all'avanguardia."
                },
                {
                    name: "Giuseppe Verdi",
                    date: "2 settimane fa",
                    rating: 4,
                    text: "Ottima auto, solo il prezzo è un po' alto. Ma per la qualità che offre vale ogni euro."
                }
            ];
            
            reviewsList.innerHTML = reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <div>
                            <div class="reviewer-name">${review.name}</div>
                            <div class="review-rating">
                                ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                            </div>
                        </div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-text">${review.text}</div>
                </div>
            `).join('');
        }
    }

                renderRelatedCars() {
                const relatedCarsGrid = document.getElementById('relatedCarsGrid');
                if (relatedCarsGrid && window.carsDatabase) {
                    // Get 3 random cars (excluding current car)
                    const otherCars = window.carsDatabase.filter(car => car.id !== this.currentCar.id);
                    const randomCars = this.shuffleArray(otherCars).slice(0, 3);
                    
                    relatedCarsGrid.innerHTML = randomCars.map(car => `
                        <div class="car-card" data-car-id="${car.id}">
                            <div class="car-image-container">
                                <img src="${car.immagini?.[0] || 'assets/images/cars/default.jpg'}" alt="${car.titolo || `${car.marca} ${car.modello}`}" class="car-image">
                                <div class="car-badge">€${car.prezzo.toLocaleString('it-IT')}</div>
                            </div>
                            <div class="car-content">
                                <h3 class="car-title">${car.titolo || `${car.marca} ${car.modello}`}</h3>
                                <div class="car-specs">
                                    <span class="car-spec">${car.anno}</span>
                                    <span class="car-spec">${car.km || 0} km</span>
                                    <span class="car-spec">${car.alimentazione}</span>
                                </div>
                                <div class="car-price">€${car.prezzo.toLocaleString('it-IT')}</div>
                                <div class="car-actions">
                                    <button class="glass-button primary shimmer" data-car-id="${car.id}">
                                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        Dettagli
                                    </button>
                                    <button class="glass-button secondary shimmer" data-car-id="${car.id}">
                                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm0-8h2v2h-2V7zm4 0h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                                        </svg>
                                        Confronta
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    setupCarImages() {
        if (this.currentCar.immagini && this.currentCar.immagini.length > 0) {
            this.carImages = this.currentCar.immagini;
            this.updateMainImage(0);
            this.renderThumbnails();
        }
    }

    updateMainImage(index) {
        const mainImage = document.getElementById('mainCarImage');
        if (mainImage && this.carImages[index]) {
            mainImage.src = this.carImages[index];
            mainImage.alt = `${this.currentCar.nome} - Immagine ${index + 1}`;
            this.currentImageIndex = index;
            this.updateThumbnailSelection();
        }
    }

    renderThumbnails() {
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        if (thumbnailGallery) {
            thumbnailGallery.innerHTML = this.carImages.map((image, index) => `
                <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${image}" alt="Thumbnail ${index + 1}">
                </div>
            `).join('');
        }
    }

    updateThumbnailSelection() {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentImageIndex);
        });
    }

    setupGallery() {
        // Previous button
        const prevBtn = document.getElementById('galleryPrev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : this.carImages.length - 1;
                this.updateMainImage(newIndex);
            });
        }
        
        // Next button
        const nextBtn = document.getElementById('galleryNext');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = this.currentImageIndex < this.carImages.length - 1 ? this.currentImageIndex + 1 : 0;
                this.updateMainImage(newIndex);
            });
        }
        
        // Thumbnail clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.thumbnail-item')) {
                const thumbnail = e.target.closest('.thumbnail-item');
                const index = parseInt(thumbnail.dataset.index);
                this.updateMainImage(index);
            }
        });
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    setupFinancingCalculator() {
        const downPaymentSlider = document.getElementById('downPayment');
        const downPaymentValue = document.getElementById('downPaymentValue');
        const loanTermSlider = document.getElementById('loanTerm');
        const loanTermValue = document.getElementById('loanTermValue');
        
        if (downPaymentSlider && downPaymentValue) {
            downPaymentSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                downPaymentValue.textContent = `${value}%`;
                this.updateMonthlyPayment();
            });
        }
        
        if (loanTermSlider && loanTermValue) {
            loanTermSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                loanTermValue.textContent = `${value} mesi`;
                this.updateMonthlyPayment();
            });
        }
    }

    updateMonthlyPayment() {
        if (!this.currentCar) return;
        
        const downPaymentSlider = document.getElementById('downPayment');
        const loanTermSlider = document.getElementById('loanTerm');
        const monthlyPaymentElement = document.getElementById('monthlyPayment');
        
        if (downPaymentSlider && loanTermSlider && monthlyPaymentElement) {
            const downPaymentPercent = parseInt(downPaymentSlider.value);
            const loanTerm = parseInt(loanTermSlider.value);
            const carPrice = this.currentCar.prezzo;
            
            const downPayment = (carPrice * downPaymentPercent) / 100;
            const loanAmount = carPrice - downPayment;
            const monthlyRate = 0.005; // 0.5% monthly interest rate (6% annual)
            
            if (monthlyRate > 0) {
                const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                                     (Math.pow(1 + monthlyRate, loanTerm) - 1);
                monthlyPaymentElement.textContent = `€${Math.round(monthlyPayment).toLocaleString('it-IT')}`;
            } else {
                monthlyPaymentElement.textContent = `€${Math.round(loanAmount / loanTerm).toLocaleString('it-IT')}`;
            }
        }
    }

    setupEventListeners() {
        // Add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }
        
        // Compare button
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.addToCompare();
            });
        }
        
        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }
        
        // Event listeners per i tab
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn));
        });
        
        // Event listeners per la galleria
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        
        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => this.previousImage());
        }
        
        if (galleryNext) {
            galleryNext.addEventListener('click', () => this.nextImage());
        }
        
        // Event listeners per i thumbnail
        document.addEventListener('click', (e) => {
            if (e.target.closest('.thumbnail-item')) {
                const thumbnail = e.target.closest('.thumbnail-item');
                const imageIndex = parseInt(thumbnail.dataset.index);
                this.showImage(imageIndex);
            }
        });
        
        // Event listeners per i pulsanti delle auto correlate
        document.addEventListener('click', (e) => {
            if (e.target.closest('.glass-button.primary')) {
                const button = e.target.closest('.glass-button.primary');
                const carId = button.dataset.carId;
                if (carId) {
                    window.location.href = `car-detail-template.html?id=${carId}`;
                }
            }
            if (e.target.closest('.glass-button.secondary')) {
                const button = e.target.closest('.glass-button.secondary');
                const carId = button.dataset.carId;
                if (carId) {
                    this.addToCompare(carId);
                }
            }
        });
        
        // Event listeners per i pulsanti del concessionario
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dealer-actions .glass-button.primary')) {
                this.contactDealer();
            }
            if (e.target.closest('.dealer-actions .glass-button.secondary')) {
                this.showDealerMap();
            }
        });
        
        // Event listeners per il calcolatore di finanziamento
        const downPaymentSlider = document.getElementById('downPayment');
        const loanTermSlider = document.getElementById('loanTerm');
        
        if (downPaymentSlider) {
            downPaymentSlider.addEventListener('input', () => this.updateFinancing());
        }
        
        if (loanTermSlider) {
            loanTermSlider.addEventListener('input', () => this.updateFinancing());
        }
    }

    addToCart() {
        if (!this.currentCar) return;
        
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('waliwheelse_cart') || '[]');
        
        // Check if car is already in cart
        const existingItem = cart.find(item => item.id === this.currentCar.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: this.currentCar.id,
                nome: this.currentCar.nome,
                prezzo: this.currentCar.prezzo,
                immagine: this.currentCar.immagini?.[0] || 'assets/images/cars/default.jpg',
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('waliwheelse_cart', JSON.stringify(cart));
        
        // Update cart count in header
        this.updateCartCount();
        
        // Show success message
        this.showToast('Auto aggiunta al carrello!', 'success');
    }

    addToCompare() {
        if (!this.currentCar) return;
        
        // Get existing compare list from localStorage
        let compareList = JSON.parse(localStorage.getItem('waliwheelse_compare') || '[]');
        
        // Check if car is already in compare list
        const existingItem = compareList.find(item => item.id === this.currentCar.id);
        
        if (existingItem) {
            this.showToast('Auto già presente nel confronto!', 'warning');
            return;
        }
        
        // Check if compare list is full (max 3 cars)
        if (compareList.length >= 3) {
            this.showToast('Rimuovi un\'auto dal confronto per aggiungerne un\'altra!', 'warning');
            return;
        }
        
        // Add car to compare list
        compareList.push({
            id: this.currentCar.id,
            nome: this.currentCar.nome,
            prezzo: this.currentCar.prezzo,
            immagine: this.currentCar.immagini?.[0] || 'assets/images/cars/default.jpg'
        });
        
        // Save to localStorage
        localStorage.setItem('waliwheelse_compare', JSON.stringify(compareList));
        
        // Show success message
        this.showToast('Auto aggiunta al confronto!', 'success');
    }

    toggleFavorite() {
        if (!this.currentCar) return;
        
        // Get existing favorites from localStorage
        let favorites = JSON.parse(localStorage.getItem('waliwheelse_favorites') || '[]');
        
        // Check if car is already in favorites
        const existingIndex = favorites.findIndex(item => item.id === this.currentCar.id);
        
        if (existingIndex >= 0) {
            // Remove from favorites
            favorites.splice(existingIndex, 1);
            this.showToast('Auto rimossa dai preferiti!', 'info');
        } else {
            // Add to favorites
            favorites.push({
                id: this.currentCar.id,
                nome: this.currentCar.nome,
                prezzo: this.currentCar.prezzo,
                immagine: this.currentCar.immagini?.[0] || 'assets/images/cars/default.jpg'
            });
            this.showToast('Auto aggiunta ai preferiti!', 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('waliwheelse_favorites', JSON.stringify(favorites));
        
        // Update favorite button appearance
        this.updateFavoriteButton(favorites.some(item => item.id === this.currentCar.id));
    }

    updateFavoriteButton(isFavorite) {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            if (isFavorite) {
                favoriteBtn.classList.add('favorited');
                favoriteBtn.innerHTML = `
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Preferiti
                `;
            } else {
                favoriteBtn.classList.remove('favorited');
                favoriteBtn.innerHTML = `
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Preferiti
                `;
            }
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('waliwheelse_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    
    contactDealer() {
        // Simula contatto concessionario
        this.showToast('Contatto concessionario in sviluppo. Email: info@waliwheelse.it', 'info');
    }
    
    showDealerMap() {
        // Simula apertura mappa
        this.showToast('Mappa concessionario in sviluppo. Indirizzo: Via Roma 123, Milano', 'info');
    }
    
    switchTab(clickedTab) {
        // Rimuovi classe active da tutti i tab
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Nascondi tutti i contenuti dei tab
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Aggiungi classe active al tab cliccato
        clickedTab.classList.add('active');
        
        // Mostra il contenuto corrispondente
        const tabName = clickedTab.dataset.tab;
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
    
    showImage(imageIndex) {
        if (!this.currentCar || !this.currentCar.immagini) return;
        
        if (imageIndex >= 0 && imageIndex < this.currentCar.immagini.length) {
            this.currentImageIndex = imageIndex;
            this.updateMainImage();
            this.updateThumbnailSelection();
        }
    }
    
    previousImage() {
        if (!this.currentCar || !this.currentCar.immagini) return;
        
        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentCar.immagini.length) % this.currentCar.immagini.length;
        this.updateMainImage();
        this.updateThumbnailSelection();
    }
    
    nextImage() {
        if (!this.currentCar || !this.currentCar.immagini) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentCar.immagini.length;
        this.updateMainImage();
        this.updateThumbnailSelection();
    }
    
    updateMainImage() {
        const mainImage = document.getElementById('mainCarImage');
        if (mainImage && this.currentCar && this.currentCar.immagini) {
            mainImage.src = this.currentCar.immagini[this.currentImageIndex];
            mainImage.alt = `${this.currentCar.nome} - Immagine ${this.currentImageIndex + 1}`;
        }
    }
    
    updateThumbnailSelection() {
        // Rimuovi selezione da tutti i thumbnail
        document.querySelectorAll('.thumbnail-item').forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Aggiungi selezione al thumbnail corrente
        const currentThumb = document.querySelector(`[data-index="${this.currentImageIndex}"]`);
        if (currentThumb) {
            currentThumb.classList.add('active');
        }
    }
    
    updateFinancing() {
        const downPaymentSlider = document.getElementById('downPayment');
        const loanTermSlider = document.getElementById('loanTerm');
        const downPaymentValue = document.getElementById('downPaymentValue');
        const loanTermValue = document.getElementById('loanTermValue');
        const monthlyPayment = document.getElementById('monthlyPayment');
        
        if (!downPaymentSlider || !loanTermSlider) return;
        
        const downPaymentPercent = parseInt(downPaymentSlider.value);
        const loanTerm = parseInt(loanTermSlider.value);
        const carPrice = this.currentCar.prezzo;
        
        const downPaymentAmount = (carPrice * downPaymentPercent) / 100;
        const loanAmount = carPrice - downPaymentAmount;
        const monthlyRate = 0.005; // 0.5% mensile (6% annuo)
        
        const monthlyPaymentAmount = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
        
        if (downPaymentValue) downPaymentValue.textContent = `${downPaymentPercent}%`;
        if (loanTermValue) loanTermValue.textContent = `${loanTerm} mesi`;
        if (monthlyPayment) monthlyPayment.textContent = `€${Math.round(monthlyPaymentAmount).toLocaleString('it-IT')}`;
    }
}

// Initialize car detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarDetailPage();
});

// Global functions for external use
function addToCompare(carId) {
    // This function can be called from related cars
    if (window.carDetailPage) {
        window.carDetailPage.addToCompare();
    }
}

// Make carDetailPage globally accessible
window.carDetailPage = null;
document.addEventListener('DOMContentLoaded', () => {
    window.carDetailPage = new CarDetailPage();
});

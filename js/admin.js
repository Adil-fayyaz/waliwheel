/**
 * Wali Wheels Admin Panel - Sistema Completo di Amministrazione
 * Gestisce utenti, auto e tutte le funzionalità admin con accesso diretto
 */

class AdminPanel {
    constructor() {
        this.cars = [];
        this.users = [];
        this.currentUser = {
            id: 'admin-001',
            name: 'Super Admin',
            email: 'admin@waliwheels.it',
            role: 'Super Admin',
            permissions: ['all']
        };
        this.filteredCars = [];
        this.searchQuery = '';
        this.currentFilter = 'all';
        this.csvDataToImport = null;
        
        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.bindEvents();
        this.initializeParallax();
        this.initializeScrollAnimations();
        this.updateStats();
        this.renderCarsTable();
    }

    // ===== GESTIONE UTENTI =====
    
    loadUsers() {
        const storedUsers = localStorage.getItem('waliwheels_users');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        } else {
            // Utenti demo
            this.users = [
                {
                    id: 'admin-001',
                    name: 'Super Admin',
                    email: 'admin@waliwheels.it',
                    role: 'Super Admin',
                    permissions: ['all'],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastLogin: new Date().toISOString()
                },
                {
                    id: 'manager-001',
                    name: 'Manager Vendite',
                    email: 'manager@waliwheels.it',
                    role: 'Manager',
                    permissions: ['cars', 'analytics'],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastLogin: null
                }
            ];
            this.saveUsersToStorage();
        }
    }

    saveUsersToStorage() {
        localStorage.setItem('waliwheels_users', JSON.stringify(this.users));
    }

    // ===== GESTIONE AUTO =====
    
    loadCarsFromStorage() {
        const storedCars = localStorage.getItem('waliwheels_cars');
        if (storedCars) {
            this.cars = JSON.parse(storedCars);
        } else {
            this.loadSampleCars();
        }
        this.filteredCars = [...this.cars];
    }

    loadSampleCars() {
        this.cars = [
            {
                id: 'car-001',
                brand: 'BMW',
                model: 'X5 M',
                year: 2024,
                price: 150000,
                type: 'suv',
                color: 'Nero Metallic',
                km: 0,
                fuel: 'benzina',
                engine: 4000,
                power: 625,
                transmission: 'automatico',
                doors: 5,
                seats: 5,
                description: 'BMW X5 M Competition - La massima espressione di potenza e lusso SUV',
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                status: 'active',
                featured: true,
                createdAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: 'car-002',
                brand: 'Mercedes',
                model: 'AMG GT',
                year: 2024,
                price: 180000,
                type: 'sportiva',
                color: 'Bianco Iridium',
                km: 0,
                fuel: 'benzina',
                engine: 4000,
                power: 585,
                transmission: 'automatico',
                doors: 2,
                seats: 2,
                description: 'Mercedes-AMG GT - Pura adrenalina su quattro ruote',
                image: 'https://images.unsplash.com/photo-1618843479618-39b0c8b0c8c1?w=800',
                status: 'active',
                featured: true,
                createdAt: '2024-01-01T00:00:00.000Z'
            }
        ];
        this.saveCarsToStorage();
    }

    addCar(carData) {
        // Validazione campi obbligatori
        if (!carData.brand || !carData.model || !carData.year || !carData.price || !carData.type) {
            this.showToast('Compila tutti i campi obbligatori', 'error');
            return false;
        }

        // Genera immagine di default se non fornita
        if (!carData.image) {
            carData.image = this.generateDefaultCarImage(carData.brand, carData.type);
        }

        this.cars.push(carData);
        this.filteredCars = [...this.cars];
        this.saveCarsToStorage();
        this.updateStats();
        this.renderCarsTable();
        
        return true;
    }

    generateDefaultCarImage(brand, type) {
        const typeImages = {
            'suv': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
            'sportiva': 'https://images.unsplash.com/photo-1618843479618-39b0c8b0c8c1?w=800',
            'berlina': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            'elettrica': 'https://images.unsplash.com/photo-1593941707882-a5bac6861d1a?w=800',
            'ibrida': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            'cabrio': 'https://images.unsplash.com/photo-1618843479618-39b0c8b0c8c1?w=800',
            'station-wagon': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
        };
        
        return typeImages[type] || typeImages['berlina'];
    }

    updateCar(carId, updatedData) {
        const index = this.cars.findIndex(car => car.id === carId);
        if (index !== -1) {
            this.cars[index] = { ...this.cars[index], ...updatedData };
            this.filteredCars = [...this.cars];
            this.saveCarsToStorage();
            this.updateStats();
            this.renderCarsTable();
            this.showToast('Auto aggiornata con successo! 🚗', 'success');
            return true;
        }
        return false;
    }

    deleteCar(carId) {
        if (confirm('Sei sicuro di voler eliminare questa auto?')) {
            this.cars = this.cars.filter(car => car.id !== carId);
            this.filteredCars = [...this.cars];
            this.saveCarsToStorage();
            this.updateStats();
            this.renderCarsTable();
            this.showToast('Auto eliminata con successo', 'success');
        }
    }

    // ===== GESTIONE FORM =====
    
    handleAddCar(e) {
        e.preventDefault();
        
        const carData = {
            id: this.generateId(),
            brand: document.getElementById('carBrand').value,
            model: document.getElementById('carModel').value,
            year: parseInt(document.getElementById('carYear').value),
            price: parseInt(document.getElementById('carPrice').value),
            type: document.getElementById('carType').value,
            color: document.getElementById('carColor').value,
            km: parseInt(document.getElementById('carKm').value) || 0,
            fuel: document.getElementById('carFuel').value,
            engine: parseInt(document.getElementById('carEngine').value) || 0,
            power: parseInt(document.getElementById('carPower').value) || 0,
            transmission: document.getElementById('carTransmission').value,
            doors: parseInt(document.getElementById('carDoors').value) || 4,
            seats: parseInt(document.getElementById('carSeats').value) || 5,
            description: document.getElementById('carDescription').value,
            image: document.getElementById('carImage').value,
            status: document.getElementById('carStatus').value,
            featured: document.getElementById('carFeatured').checked,
            createdAt: new Date().toISOString()
        };
        
        // Gestione immagini multiple dal PC (almeno 6, solo immagini)
        const filesInput = document.getElementById('carImages');
        const allFiles = filesInput && filesInput.files ? Array.from(filesInput.files) : [];

        // Filtra solo immagini (fallback a estensione se manca MIME)
        const imageFiles = allFiles.filter((f) => this.isImageFile(f));

        if (allFiles.length === 0) {
            this.showToast('Seleziona almeno 6 foto dell\'auto dal tuo PC', 'error');
            return;
        }

        if (imageFiles.length !== allFiles.length) {
            this.showToast('Sono stati rilevati file non immagine. Seleziona solo immagini.', 'error');
            return;
        }

        if (imageFiles.length < 6) {
            this.showToast('Seleziona almeno 6 foto (tutte immagini valide).', 'error');
            return;
        }

        if (imageFiles.length > 20) {
            this.showToast('Massimo 20 foto per auto. Seleziona fino a 20 immagini.', 'error');
            return;
        }

            this.readFilesAsDataUrls(imageFiles).then((images) => {
            if (images.length < 6) {
                this.showToast(`Sono state lette solo ${images.length} immagini valide. Seleziona almeno 6 immagini.`, 'error');
                return;
            }
            if (images.length > 20) {
                images = images.slice(0, 20); // Limita a 20 immagini
                this.showToast(`Utilizzate le prime 20 immagini delle ${imageFiles.length} selezionate.`, 'info');
            }
            // Usa la prima come immagine principale
            carData.image = carData.image || images[0];
            carData.images = images; // salva tutte le immagini

            if (this.addCar(carData)) {
                this.closeAddCarModal();
                e.target.reset();
                // Svuota l'anteprima
                const prev = document.getElementById('carImagesPreview');
                if (prev) prev.innerHTML = '';
                this.showToast('Auto aggiunta con successo! 🚗', 'success');
            }
        }).catch((err) => {
            this.showToast(`Errore nella lettura delle immagini selezionate`, 'error');
        });
    }

    // ===== RICERCA E FILTRI =====
    
    handleSearch() {
        this.searchQuery = document.getElementById('searchCars').value.toLowerCase();
        this.applyFiltersAndSearch();
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.applyFiltersAndSearch();
    }

    applyFiltersAndSearch() {
        this.filteredCars = this.cars.filter(car => {
            // Filtro per stato
            if (this.currentFilter !== 'all' && car.status !== this.currentFilter) {
                return false;
            }
            
            // Ricerca per marca, modello, descrizione e specifiche tecniche
            if (this.searchQuery) {
                const searchText = `${car.brand} ${car.model} ${car.description || ''} ${car.color || ''} ${car.fuel || ''} ${car.type || ''} ${car.transmission || ''}`.toLowerCase();
                if (!searchText.includes(this.searchQuery)) {
                    return false;
                }
            }
            
            return true;
        });

        this.renderCarsTable();
    }

    // ===== RENDERING TABELLA =====

    renderCarsTable() {
        const tbody = document.getElementById('carsTableBody');
        const noCarsMessage = document.getElementById('noCarsMessage');
        
        if (this.filteredCars.length === 0) {
            tbody.innerHTML = '';
            noCarsMessage.style.display = 'block';
            return;
        }
        
        noCarsMessage.style.display = 'none';
        tbody.innerHTML = this.filteredCars.map(car => this.createCarTableRow(car)).join('');
    }

    createCarTableRow(car) {
        const typeIcon = this.getCarIcon(car.type);
        const typeLabel = this.getTypeLabel(car.type);
        const statusClass = car.status || 'active';
        const statusLabel = this.getStatusLabel(car.status || 'active');
        
        return `
            <tr data-car-id="${car.id}">
                <td class="car-image-cell">
                    <div class="car-image-thumb">
                        ${car.image ? `<img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">` : typeIcon}
                    </div>
                </td>
                <td>
                    <div class="car-brand-model">${car.brand} ${car.model}</div>
                    <div class="car-details-small">
                        ${car.color || 'N/A'} • ${car.fuel || 'N/A'} • ${car.transmission || 'N/A'}
                    </div>
                    <div class="car-specs-small">
                        ${car.engine ? car.engine + 'cc' : ''} ${car.power ? '• ' + car.power + 'CV' : ''} ${car.doors ? '• ' + car.doors + ' porte' : ''}
                    </div>
                </td>
                <td>${car.year}</td>
                <td class="price-cell">
                    <div class="price-amount">€${car.price.toLocaleString()}</div>
                    ${car.featured ? '<span class="featured-badge">⭐</span>' : ''}
                </td>
                <td>
                    <div class="type-badge">
                        ${typeIcon} ${typeLabel}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </td>
                <td class="actions-cell">
                    <button class="action-btn view" onclick="adminPanel.viewCar('${car.id}')" title="Visualizza">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </button>
                    <button class="action-btn edit" onclick="adminPanel.editCar('${car.id}')" title="Modifica">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                    <button class="action-btn delete" onclick="adminPanel.deleteCar('${car.id}')" title="Elimina">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </td>
            </tr>
        `;
    }

    // ===== UTILITY FUNCTIONS =====
    
    getCarIcon(type) {
        const icons = {
            'suv': '🚙',
            'sportiva': '🏎️',
            'berlina': '🚗',
            'elettrica': '⚡',
            'ibrida': '🔋',
            'cabrio': '🌞',
            'station-wagon': '🚐'
        };
        return icons[type] || '🚗';
    }

    getTypeLabel(type) {
        const labels = {
            'suv': 'SUV',
            'sportiva': 'Sportiva',
            'berlina': 'Berlina',
            'elettrica': 'Elettrica',
            'ibrida': 'Ibrida',
            'cabrio': 'Cabrio',
            'station-wagon': 'Station Wagon'
        };
        return labels[type] || type;
    }

    getStatusLabel(status) {
        const labels = {
            'active': 'Attiva',
            'draft': 'Bozza',
            'archived': 'Archiviata'
        };
        return labels[status] || status;
    }

    generateId() {
        return 'car-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    updateStats() {
        const totalCars = this.cars.length;
        const activeCars = this.cars.filter(car => car.status === 'active').length;
        const totalBrands = new Set(this.cars.map(car => car.brand)).size;
        const totalUsers = this.users.length;

        document.getElementById('totalCars').textContent = totalCars;
        document.getElementById('activeCars').textContent = activeCars;
        document.getElementById('totalBrands').textContent = totalBrands;
        document.getElementById('totalUsers').textContent = totalUsers;

        // Anima i numeri
        this.animateStats();
    }

    animateStats() {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const finalValue = parseInt(stat.getAttribute('data-count'));
            let currentValue = 0;
            const increment = finalValue / 20;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue);
            }, 50);
        });
    }

    // ===== GESTIONE AUTO INDIVIDUALI =====
    
    viewCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            alert(`Visualizzazione auto: ${car.brand} ${car.model}\nPrezzo: €${car.price.toLocaleString()}\nAnno: ${car.year}\nTipo: ${this.getTypeLabel(car.type)}`);
        }
    }

    editCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            // Popola il form con i dati dell'auto
            document.getElementById('carBrand').value = car.brand;
            document.getElementById('carModel').value = car.model;
            document.getElementById('carYear').value = car.year;
            document.getElementById('carPrice').value = car.price;
            document.getElementById('carType').value = car.type;
            document.getElementById('carColor').value = car.color || '';
            document.getElementById('carKm').value = car.km || '';
            document.getElementById('carFuel').value = car.fuel || '';
            document.getElementById('carEngine').value = car.engine || '';
            document.getElementById('carPower').value = car.power || '';
            document.getElementById('carTransmission').value = car.transmission || '';
            document.getElementById('carDoors').value = car.doors || '';
            document.getElementById('carSeats').value = car.seats || '';
            document.getElementById('carDescription').value = car.description || '';
            document.getElementById('carImage').value = car.image || '';
            document.getElementById('carStatus').value = car.status || 'active';
            document.getElementById('carFeatured').checked = car.featured || false;
            
            // Cambia il titolo del modal
            document.querySelector('#addCarModal .modal-header h2').innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; margin-right: 10px;">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Modifica Auto
            `;
            
            // Cambia il pulsante
            const submitBtn = document.querySelector('#addCarModal .form-actions .glass-button.primary');
            submitBtn.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                ✓ Aggiorna Auto
            `;
            
            // Salva l'ID dell'auto da modificare
            document.getElementById('addCarModal').setAttribute('data-editing-car', carId);
            
            this.openAddCarModal();
        }
    }

    // ===== SALVATAGGIO E PERSISTENZA =====
    
    saveCarsToStorage() {
        localStorage.setItem('waliwheels_cars', JSON.stringify(this.cars));
    }

    // ===== GESTIONE MODAL =====
    
    openAddCarModal() {
        document.getElementById('addCarModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAddCarModal() {
        document.getElementById('addCarModal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset del form
        document.getElementById('addCarForm').reset();
        
        // Reset del titolo e pulsante
        document.querySelector('#addCarModal .modal-header h2').innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; margin-right: 10px;">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13S8 13.67 8 14.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            Aggiungi Nuova Auto
        `;
        
        const submitBtn = document.querySelector('#addCarModal .form-actions .glass-button.primary');
        submitBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            ✓ Aggiungi Auto
        `;
        
        // Rimuovi l'ID dell'auto in modifica
        document.getElementById('addCarModal').removeAttribute('data-editing-car');
    }

    openBulkUploadModal() {
        document.getElementById('bulkUploadModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeBulkUploadModal() {
        document.getElementById('bulkUploadModal').classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('uploadPreview').style.display = 'none';
        document.getElementById('csvFile').value = '';
    }

    // ===== CARICAMENTO MASSIVO CSV =====
    
    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            const parsedData = this.parseCSV(csvData);
            
            if (parsedData.length > 0) {
                this.csvDataToImport = parsedData;
                this.showCSVPreview(parsedData);
                document.getElementById('confirmUpload').disabled = false;
            } else {
                this.showToast('Errore nella lettura del file CSV', 'error');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }

        return data;
    }

    showCSVPreview(data) {
        const previewTable = document.getElementById('previewTable');
        const preview = data.slice(0, 5).map(row => `
            <div class="preview-row">
                <span>${row.Marca || row.marca || 'N/A'}</span>
                <span>${row.Modello || row.modello || 'N/A'}</span>
                <span>${row.Anno || row.anno || 'N/A'}</span>
                <span>€${row.Prezzo || row.prezzo || 'N/A'}</span>
            </div>
        `).join('');

        previewTable.innerHTML = `
            <div class="preview-header">
                <span>Marca</span>
                <span>Modello</span>
                <span>Anno</span>
                <span>Prezzo</span>
            </div>
            ${preview}
            ${data.length > 5 ? `<div class="preview-more">... e altre ${data.length - 5} auto</div>` : ''}
        `;

        document.getElementById('uploadPreview').style.display = 'block';
    }

    confirmBulkUpload() {
        if (!this.csvDataToImport || this.csvDataToImport.length === 0) {
            this.showToast('Nessun dato da importare', 'error');
            return;
        }

        let importedCount = 0;
        let errorCount = 0;
        
        this.csvDataToImport.forEach(row => {
            try {
                const carData = {
                    id: this.generateId(),
                    brand: row.Marca || row.marca || '',
                    model: row.Modello || row.modello || '',
                    year: parseInt(row.Anno || row.anno) || new Date().getFullYear(),
                    price: parseInt(row.Prezzo || row.prezzo) || 0,
                    type: row.Tipo || row.tipo || 'berlina',
                    color: row.Colore || row.colore || '',
                    km: parseInt(row.Km || row.km) || 0,
                    fuel: row.Carburante || row.carburante || 'benzina',
                    engine: parseInt(row.Motore || row.motore) || 0,
                    power: parseInt(row.Potenza || row.potenza) || 0,
                    transmission: row.Cambio || row.cambio || 'manuale',
                    doors: parseInt(row.Porte || row.porte) || 4,
                    seats: parseInt(row.Posti || row.posti) || 5,
                    description: row.Descrizione || row.descrizione || '',
                    image: row.Immagine || row.immagine || '',
                    status: 'active',
                    featured: false,
                    createdAt: new Date().toISOString()
                };
                
                if (carData.brand && carData.model && carData.price > 0) {
                    this.cars.push(carData);
                    importedCount++;
                } else {
                    errorCount++;
                }
            } catch (e) {
                errorCount++;
            }
        });
        
        this.filteredCars = [...this.cars];
        this.saveCarsToStorage();
        this.updateStats();
        this.renderCarsTable();
        
        this.showToast(`Importazione completata! ${importedCount} auto importate, ${errorCount} errori`, 'success');
        this.closeBulkUploadModal();
    }

    downloadCSVTemplate() {
        const headers = ['Marca', 'Modello', 'Anno', 'Prezzo', 'Tipo', 'Colore', 'Km', 'Carburante', 'Motore', 'Potenza', 'Cambio', 'Porte', 'Posti', 'Descrizione', 'Immagine'];
        const template = [headers.join(',')].join('\n');
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_auto.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // ===== FUNZIONI PLACEHOLDER =====
    
    openAnalyticsModal() {
        this.showToast('Funzionalità Analytics in sviluppo... 📊', 'info');
    }

    openSettingsModal() {
        this.showToast('Funzionalità Impostazioni in sviluppo... ⚙️', 'info');
    }

    showProfileSettings() {
        this.showToast('Impostazioni profilo in sviluppo... 👤', 'info');
    }

    showSecuritySettings() {
        this.showToast('Impostazioni sicurezza in sviluppo... 🔒', 'info');
    }

    showSystemInfo() {
        this.showToast('Informazioni sistema in sviluppo... 💻', 'info');
    }

    showUserMenu() {
        const menu = document.getElementById('userMenu');
        menu.classList.toggle('active');
    }

    // ===== SISTEMA TOAST =====
    
    showToast(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Crea il toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Aggiungi al container
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            
            // Mostra il toast
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Rimuovi automaticamente dopo 5 secondi
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        }
    }

    // ===== ANIMAZIONI E EFFETTI =====
    
    initializeParallax() {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 0.5;
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

    // ===== BINDING EVENTI =====
    
    bindEvents() {
        // Form aggiunta auto
        const addCarForm = document.getElementById('addCarForm');
        if (addCarForm) {
            addCarForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCar(e);
            });
        }

        // Preview immagini selezionate
        const carImagesInput = document.getElementById('carImages');
        if (carImagesInput) {
            carImagesInput.addEventListener('change', (e) => this.handleImagesPreview(e));
        }

        // Ricerca auto
        const searchInput = document.getElementById('searchCars');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        // Filtri
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Upload CSV
        const csvFileInput = document.getElementById('csvFile');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => this.handleCSVUpload(e));
        }

        // Chiusura modali con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAddCarModal();
                this.closeBulkUploadModal();
            }
        });

        // Chiusura modali cliccando fuori
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAddCarModal();
                this.closeBulkUploadModal();
            }
        });

        // Chiusura menu utente cliccando fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.admin-user')) {
                const userMenu = document.getElementById('userMenu');
                if (userMenu) {
                    userMenu.classList.remove('active');
                }
            }
        });
    }

    // ===== IMMAGINI MULTIPLE =====
    handleImagesPreview(event) {
        const preview = document.getElementById('carImagesPreview');
        if (!preview) return;
        preview.innerHTML = '';
        const allFiles = Array.from(event.target.files || []);
        const imageFiles = allFiles.filter((f) => this.isImageFile(f));

        if (imageFiles.length !== allFiles.length) {
            this.showToast('Alcuni file non sono immagini e verranno ignorati.', 'error');
        }

        imageFiles.slice(0, 20).forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `foto-${idx+1}`;
                img.style.width = '100%';
                img.style.height = '70px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                img.style.border = '1px solid rgba(255,255,255,0.15)';
                preview.appendChild(img);
            };
            reader.onerror = () => {
                this.showToast(`Errore nella lettura dell'immagine ${file.name}`, 'error');
            };
            reader.readAsDataURL(file);
        });
    }

    readFilesAsDataUrls(files) {
        // Lettura con allSettled per non fallire se una singola immagine dà errore
        const tasks = files.map((file) => new Promise((resolve, reject) => {
            if (!this.isImageFile(file)) {
                return reject(new Error('File non immagine'));
            }
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error(`Errore lettura: ${file.name}`));
            reader.readAsDataURL(file);
        }));

        return Promise.allSettled(tasks).then((results) => {
            const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value);
            const failed = results.filter(r => r.status === 'rejected');
            if (failed.length > 0) {
                this.showToast(`Immagini lette: ${ok.length}. Fallite: ${failed.length}.`, 'error');
            }
            return ok;
        });
    }

    isImageFile(file) {
        if (!file) return false;
        if (file.type && typeof file.type === 'string') {
            if (file.type.startsWith('image/')) return true;
        }
        // fallback: controlla estensione
        const name = (file.name || '').toLowerCase();
        return /(\.jpg|\.jpeg|\.png|\.gif|\.webp|\.bmp|\.svg)$/.test(name);
    }

    loadDataFromStorage() {
        this.loadCarsFromStorage();
        this.loadUsers();
    }
}

// ===== FUNZIONI GLOBALI =====

let adminPanel;

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

// Funzioni globali per i pulsanti HTML
function openAddCarModal() {
    if (adminPanel) adminPanel.openAddCarModal();
}

function closeAddCarModal() {
    if (adminPanel) adminPanel.closeAddCarModal();
}

function openBulkUploadModal() {
    if (adminPanel) adminPanel.openBulkUploadModal();
}

function closeBulkUploadModal() {
    if (adminPanel) adminPanel.closeBulkUploadModal();
}

function showUserMenu() {
    if (adminPanel) adminPanel.showUserMenu();
}

function showProfileSettings() {
    if (adminPanel) adminPanel.showProfileSettings();
}

function showSecuritySettings() {
    if (adminPanel) adminPanel.showSecuritySettings();
}

function showSystemInfo() {
    if (adminPanel) adminPanel.showSystemInfo();
}

function downloadCSVTemplate() {
    if (adminPanel) adminPanel.downloadCSVTemplate();
}

function confirmBulkUpload() {
    if (adminPanel) adminPanel.confirmBulkUpload();
}

function openAnalyticsModal() {
    if (adminPanel) adminPanel.openAnalyticsModal();
}

function openSettingsModal() {
    if (adminPanel) adminPanel.openSettingsModal();
}

/**
 * Admin Panel - Wali Wheels
 * Sistema completo di gestione amministrativa per concessionaria auto
 * Versione 3.0 - CRUD Completo + Dashboard + Sicurezza + Gestione Utenti + Analytics + Settings
 */

class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.cars = [];
        this.users = [];
        this.stats = {};
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        console.log('🚀 AdminPanel inizializzato');
        this.checkAuth();
        this.loadData();
        this.setupEventListeners();
        this.setupImageInputs();
        this.renderDashboard();
        this.renderCarsTable();
        this.updateStats();
    }
    
    // ===== SICUREZZA E AUTENTICAZIONE =====
    
    checkAuth() {
        // Simula controllo autenticazione (in produzione usare JWT/sessioni)
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
            this.showLoginModal();
        } else {
            this.currentUser = {
                id: 'admin_001',
                name: 'Amministratore',
                role: 'super_admin',
                email: 'admin@waliwheels.it'
            };
            this.updateUserInfo();
        }
    }
    
    showLoginModal() {
        const loginHTML = `
            <div class="modal-overlay active" id="loginModal">
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>🔐 Accesso Admin</h2>
                    </div>
                    <div style="padding: 2rem;">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="adminEmail">Email</label>
                                <input type="email" id="adminEmail" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="adminPassword">Password</label>
                                <input type="password" id="adminPassword" class="form-input" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="filter-btn primary">Accedi</button>
                            </div>
                        </form>
                        <div style="margin-top: 1rem; text-align: center;">
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                                💡 <strong>Demo:</strong> admin@waliwheels.it / admin123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loginHTML);
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
                e.preventDefault();
            this.handleLogin();
        });
    }
    
    handleLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simula autenticazione (in produzione usare API sicura)
        if (email === 'admin@waliwheels.it' && password === 'admin123') {
            localStorage.setItem('admin_token', 'demo_token_123');
            this.currentUser = {
                id: 'admin_001',
                name: 'Amministratore',
                role: 'super_admin',
                email: email
            };
            
            document.getElementById('loginModal').remove();
            this.updateUserInfo();
            this.showToast('✅ Accesso effettuato con successo!', 'success');
        } else {
            this.showToast('❌ Credenziali non valide!', 'error');
        }
    }
    
    logout() {
        localStorage.removeItem('admin_token');
        this.currentUser = null;
        this.showToast('👋 Logout effettuato', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    updateUserInfo() {
        const userElement = document.querySelector('.user-name');
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser.name;
        }
    }
    
    // ===== GESTIONE DATI =====
    
    loadData() {
        this.loadCars();
        this.loadUsers();
        this.loadStats();
    }
    
    loadCars() {
        try {
            const storedCars = localStorage.getItem('waliwheels_cars');
            this.cars = storedCars ? JSON.parse(storedCars) : [];
        } catch (e) {
            console.error('Errore caricamento auto:', e);
            this.cars = [];
        }
    }
    
    loadUsers() {
        try {
            const storedUsers = localStorage.getItem('waliwheels_users');
            this.users = storedUsers ? JSON.parse(storedUsers) : [
                {
                    id: 'admin_001',
                    name: 'Amministratore',
                    email: 'admin@waliwheels.it',
                    role: 'admin',
                    status: 'active',
                    createdAt: '2024-01-01'
                }
            ];
        } catch (e) {
            console.error('Errore caricamento utenti:', e);
            this.users = [];
        }
    }
    
    loadStats() {
        this.stats = {
            totalCars: this.cars.length,
            activeCars: this.cars.filter(car => car.status === 'active').length,
            featuredCars: this.cars.filter(car => car.featured).length,
            totalUsers: this.users.length,
            totalViews: Math.floor(Math.random() * 10000) + 1000,
            monthlyRevenue: Math.floor(Math.random() * 100000) + 50000
        };
    }
    
    // ===== EVENT LISTENERS =====
    
    setupEventListeners() {
        // Form aggiunta auto
        const addCarForm = document.getElementById('addCarForm');
        if (addCarForm) {
            addCarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCar();
        });
        }

        // Form aggiunta utente
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddUser();
            });
        }

        // Form modifica auto
        const editCarForm = document.getElementById('editCarForm');
        if (editCarForm) {
            editCarForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditCar();
            });
        }
        
        // Ricerca e filtri
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderCarsTable();
            });
        }
        
        // Menu utente
        const adminUser = document.querySelector('.admin-user');
        if (adminUser) {
            adminUser.addEventListener('click', () => this.toggleUserMenu());
        }
        
        // Click fuori per chiudere menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.admin-user')) {
                this.closeUserMenu();
            }
        });

        // Click fuori per chiudere modali
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ===== GESTIONE SEZIONI =====

    showSection(sectionName) {
        // Nascondi tutte le sezioni
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Mostra la sezione selezionata
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
        }
        
        // Aggiorna i pulsanti di navigazione
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[onclick="adminPanel.showSection('${sectionName}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Carica i dati specifici della sezione
        switch (sectionName) {
            case 'cars':
                this.renderCarsTable();
                break;
            case 'users':
                this.renderUsersTable();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    // ===== GESTIONE AUTO (CRUD) =====
    
    handleAddCar() {
        const formData = new FormData(document.getElementById('addCarForm'));
        
        // Raccogli tutti i dati del form
        const carData = {
            id: Date.now().toString(),
            brand: formData.get('brand') || document.getElementById('brand').value,
            model: formData.get('model') || document.getElementById('model').value,
            year: parseInt(formData.get('year') || document.getElementById('year').value),
            price: parseInt(formData.get('price') || document.getElementById('price').value),
            type: formData.get('type') || document.getElementById('type').value,
            color: formData.get('color') || document.getElementById('color').value,
            fuel: formData.get('fuel') || document.getElementById('fuel').value,
            km: parseInt(formData.get('km') || document.getElementById('km').value) || 0,
            engine: parseInt(formData.get('engine') || document.getElementById('engine').value) || 0,
            power: parseInt(formData.get('power') || document.getElementById('power').value) || 0,
            transmission: formData.get('transmission') || document.getElementById('transmission').value,
            doors: parseInt(formData.get('doors') || document.getElementById('doors').value) || 0,
            seats: parseInt(formData.get('seats') || document.getElementById('seats').value) || 0,
            description: formData.get('description') || document.getElementById('description').value,
            featured: formData.get('featured') === 'on' || document.getElementById('featured').checked,
            status: 'active',
            createdAt: new Date().toISOString(),
            views: 0,
            favorites: 0
        };

        // Raccogli le immagini
        const imageInputs = document.querySelectorAll('.image-url-input');
        const images = [];
        
        imageInputs.forEach((input, index) => {
            if (input.value.trim()) {
                images.push(input.value.trim());
            }
        });

        // Validazione: richiedi almeno 5 immagini
        if (images.length < 5) {
            this.showToast('⚠️ Inserisci almeno 5 immagini per ogni auto!', 'error');
            return;
        }

        carData.images = images;
        carData.image = images[0]; // Prima immagine come immagine principale

        // Validazione base
        if (!carData.brand || !carData.model || !carData.year || !carData.price) {
            this.showToast('⚠️ Compila tutti i campi obbligatori!', 'error');
            return;
        }

        // Aggiungi l'auto
        this.addCar(carData);
        
        // Chiudi il modal
        this.closeModal('addCarModal');
        
        // Reset del form
        document.getElementById('addCarForm').reset();
        
        // Reset delle anteprime immagini
        this.resetImagePreviews();
        
        this.showToast('✅ Auto aggiunta con successo!', 'success');
    }

    handleEditCar() {
        const form = document.getElementById('editCarForm');
        const carId = form.dataset.carId;
        
        if (!carId) return;
        
        const formData = new FormData(form);
        const updatedData = {
            brand: formData.get('editBrand'),
            model: formData.get('editModel'),
            year: parseInt(formData.get('editYear')),
            price: parseInt(formData.get('editPrice')),
            type: formData.get('editType'),
            color: formData.get('editColor'),
            fuel: formData.get('editFuel'),
            km: parseInt(formData.get('editKm')) || 0,
            engine: parseInt(formData.get('editEngine')) || 0,
            power: parseInt(formData.get('editPower')) || 0,
            transmission: formData.get('editTransmission'),
            doors: parseInt(formData.get('editDoors')) || 0,
            seats: parseInt(formData.get('editSeats')) || 0,
            description: formData.get('editDescription'),
            featured: formData.get('editFeatured') === 'on',
            status: formData.get('editStatus'),
            updatedAt: new Date().toISOString()
        };
        
        this.updateCar(carId, updatedData);
        this.closeModal('editCarModal');
    }

    handleAddUser() {
        const formData = new FormData(document.getElementById('addUserForm'));
        
        // Raccogli i permessi selezionati
        const permissions = [];
        document.querySelectorAll('input[name="permissions"]:checked').forEach(checkbox => {
            permissions.push(checkbox.value);
        });
        
        const userData = {
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            role: formData.get('userRole'),
            status: formData.get('userStatus') || 'active',
            permissions: permissions
        };
        
        // Validazione
        if (!userData.name || !userData.email || !userData.role) {
            this.showToast('⚠️ Compila tutti i campi obbligatori!', 'error');
            return;
        }
        
        // Verifica email unica
        if (this.users.some(user => user.email === userData.email)) {
            this.showToast('⚠️ Email già esistente!', 'error');
            return;
        }
        
        this.addUser(userData);
        
        // Reset form
        document.getElementById('addUserForm').reset();
    }
    
    addCar(carData) {
        this.cars.push(carData);
        this.saveCars();
        this.renderCarsTable();
        this.updateStats();
        this.renderDashboard();
    }
    
    updateCar(carId, updatedData) {
        const index = this.cars.findIndex(c => c.id === carId);
        if (index !== -1) {
            this.cars[index] = { ...this.cars[index], ...updatedData };
            this.saveCars();
            this.renderCarsTable();
            this.updateStats();
            this.showToast('✅ Auto aggiornata con successo!', 'success');
        }
    }
    
    deleteCar(carId) {
        if (confirm('⚠️ Sei sicuro di voler eliminare questa auto?')) {
            this.cars = this.cars.filter(c => c.id !== carId);
            this.saveCars();
            this.renderCarsTable();
            this.updateStats();
            this.renderDashboard();
            this.showToast('🗑️ Auto eliminata con successo!', 'success');
        }
    }
    
    saveCars() {
        localStorage.setItem('waliwheels_cars', JSON.stringify(this.cars));
    }

    // ===== GESTIONE UTENTI =====
    
    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (this.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <div style="opacity: 0.7;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 48px; height: 48px; margin-bottom: 1rem;">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
                            </svg>
                            <p>Nessun utente presente nel sistema</p>
                            <button class="filter-btn primary" onclick="adminPanel.openModal('addUserModal')" style="margin-top: 1rem;">
                                Aggiungi Primo Utente
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>
                    <div class="user-info" style="display: flex; align-items: center; gap: 1rem;">
                        <div class="user-avatar" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; background: linear-gradient(135deg, ${this.getRandomColor()}, ${this.getRandomColor()});">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-details">
                            <div class="user-name" style="font-weight: 600; color: var(--text-color);">${user.name}</div>
                            <div class="user-id" style="font-size: 0.8rem; color: var(--text-secondary);">#${user.id}</div>
                        </div>
                    </div>
                </td>
                <td style="color: var(--text-color);">${user.email}</td>
                <td>
                    <span class="role-badge" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: rgba(0, 255, 136, 0.2); color: var(--primary-color);">
                        ${this.formatRole(user.role)}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: ${user.status === 'active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 53, 0.2)'}; color: ${user.status === 'active' ? 'var(--primary-color)' : '#ff6b35'};">
                        ${this.formatStatus(user.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                        <button class="action-btn edit" onclick="adminPanel.editUser('${user.id}')" title="Modifica" style="background: rgba(255, 255, 255, 0.1); border: none; padding: 0.5rem; border-radius: 8px; color: var(--text-color); cursor: pointer; transition: all 0.3s ease;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteUser('${user.id}')" title="Elimina" style="background: rgba(255, 107, 53, 0.2); border: none; padding: 0.5rem; border-radius: 8px; color: #ff6b35; cursor: pointer; transition: all 0.3s ease;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    addUser(userData) {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        localStorage.setItem('waliwheels_users', JSON.stringify(this.users));
        
        this.showToast('✅ Utente aggiunto con successo!', 'success');
        this.renderUsersTable();
        this.closeModal('addUserModal');
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        // Implementazione modal di modifica utente
        console.log('Modifica utente:', user);
        this.showToast('🔧 Funzionalità in sviluppo!', 'info');
    }

    deleteUser(userId) {
        if (confirm('Sei sicuro di voler eliminare questo utente?')) {
            this.users = this.users.filter(u => u.id !== userId);
            localStorage.setItem('waliwheels_users', JSON.stringify(this.users));
            
            this.showToast('🗑️ Utente eliminato con successo!', 'success');
        this.renderUsersTable();
        }
    }

    // ===== ANALYTICS =====
    
    renderAnalytics() {
        // Aggiorna le statistiche
        document.getElementById('totalViews').textContent = this.stats.totalViews?.toLocaleString() || '0';
        document.getElementById('monthlyRevenue').textContent = `€${this.stats.monthlyRevenue?.toLocaleString() || '0'}`;
        document.getElementById('totalCarsAnalytics').textContent = this.cars.length;
        document.getElementById('featuredCarsAnalytics').textContent = this.cars.filter(car => car.featured).length;
        document.getElementById('totalUsersAnalytics').textContent = this.users.length;
        document.getElementById('activeUsers').textContent = this.users.filter(user => user.status === 'active').length;
    }

    // ===== SETTINGS =====
    
    renderSettings() {
        // Carica le impostazioni salvate
        const settings = JSON.parse(localStorage.getItem('waliwheels_settings') || '{}');
        
        // Applica le impostazioni ai controlli
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }

    saveSettings() {
        const settings = {};
        const settingsInputs = document.querySelectorAll('#settingsSection input, #settingsSection select');
        
        settingsInputs.forEach(input => {
            if (input.type === 'checkbox') {
                settings[input.id] = input.checked;
            } else {
                settings[input.id] = input.value;
            }
        });
        
        localStorage.setItem('waliwheels_settings', JSON.stringify(settings));
        this.showToast('✅ Impostazioni salvate con successo!', 'success');
    }

    // ===== DASHBOARD E TABELLA AUTO =====
    
    renderDashboard() {
        this.updateStats();
        
        // Aggiorna numeri dashboard
        const totalCarsElement = document.getElementById('totalCars');
        const activeCarsElement = document.getElementById('activeCars');
        
        if (totalCarsElement) totalCarsElement.textContent = this.stats.totalCars;
        if (activeCarsElement) activeCarsElement.textContent = this.stats.activeCars;
    }
    
    updateStats() {
        this.stats = {
            totalCars: this.cars.length,
            activeCars: this.cars.filter(car => car.status === 'active').length,
            featuredCars: this.cars.filter(car => car.featured).length,
            totalUsers: this.users.length,
            totalViews: Math.floor(Math.random() * 10000) + 1000,
            monthlyRevenue: Math.floor(Math.random() * 100000) + 50000
        };
    }
    
    renderCarsTable() {
        const tbody = document.getElementById('carsTableBody');
        if (!tbody) return;

        let filteredCars = this.cars;
        
        // Applica filtri
        if (this.currentFilter !== 'all') {
            filteredCars = filteredCars.filter(car => {
                if (this.currentFilter === 'active') return car.status === 'active';
                if (this.currentFilter === 'draft') return car.status === 'draft';
                if (this.currentFilter === 'featured') return car.featured;
                return true;
            });
        }
        
        // Applica ricerca
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filteredCars = filteredCars.filter(car => 
                car.brand.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query) ||
                (car.description && car.description.toLowerCase().includes(query))
            );
        }
        
        if (filteredCars.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <div style="opacity: 0.7;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 64px; height: 64px; margin-bottom: 1rem;">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z"/>
                            </svg>
                            <h3>Nessuna auto trovata</h3>
                            <p>${this.searchQuery ? 'Prova a modificare i criteri di ricerca.' : 'Inizia aggiungendo la tua prima auto!'}</p>
                            ${!this.searchQuery ? `<button class="filter-btn primary" onclick="adminPanel.openModal('addCarModal')" style="margin-top: 1rem;">Aggiungi Prima Auto</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredCars.map(car => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="car-image-thumb" style="width: 60px; height: 45px; border-radius: 8px; overflow: hidden; background: rgba(255, 255, 255, 0.1);">
                            ${car.image ? `<img src="${car.image}" alt="${car.brand} ${car.model}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1.5rem;">🚗</div>'}
                        </div>
                        <div>
                            <div class="car-brand-model" style="font-weight: 600; color: var(--text-color); margin-bottom: 0.25rem;">${car.brand} ${car.model}</div>
                            <div class="car-details-small" style="font-size: 0.8rem; color: var(--text-secondary);">
                                ${car.year} • ${car.km ? car.km.toLocaleString() + ' km' : '0 km'}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="price-amount" style="font-weight: 600; color: var(--primary-color); font-size: 1.1rem;">€${car.price.toLocaleString()}</div>
                    ${car.featured ? '<div class="featured-badge" style="font-size: 0.8rem; color: var(--secondary-color);">⭐ In Evidenza</div>' : ''}
                </td>
                <td>
                    <span class="type-badge" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: rgba(102, 126, 234, 0.2); color: #667eea;">
                        ${car.type}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${car.status}" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: ${car.status === 'active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 53, 0.2)'}; color: ${car.status === 'active' ? 'var(--primary-color)' : '#ff6b35'};">
                        ${car.status === 'active' ? 'Attiva' : 'Bozza'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                        <button class="action-btn view" onclick="adminPanel.viewCar('${car.id}')" title="Visualizza" style="background: rgba(255, 255, 255, 0.1); border: none; padding: 0.5rem; border-radius: 8px; color: var(--text-color); cursor: pointer; transition: all 0.3s ease;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                        <button class="action-btn edit" onclick="adminPanel.editCar('${car.id}')" title="Modifica" style="background: rgba(255, 255, 255, 0.1); border: none; padding: 0.5rem; border-radius: 8px; color: var(--text-color); cursor: pointer; transition: all 0.3s ease;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteCar('${car.id}')" title="Elimina" style="background: rgba(255, 107, 53, 0.2); border: none; padding: 0.5rem; border-radius: 8px; color: #ff6b35; cursor: pointer; transition: all 0.3s ease;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== GESTIONE AUTO - MODALI =====
    
    editCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        // Popola il modal di modifica con i dati dell'auto
        const fields = ['Brand', 'Model', 'Year', 'Price', 'Type', 'Color', 'Fuel', 'Km', 'Engine', 'Power', 'Transmission', 'Doors', 'Seats', 'Description', 'Status'];
        
        fields.forEach(field => {
            const input = document.getElementById('edit' + field);
            if (input && car[field.toLowerCase()]) {
                if (input.type === 'checkbox') {
                    input.checked = car[field.toLowerCase()];
                } else {
                    input.value = car[field.toLowerCase()];
                }
            }
        });
        
        // Gestisci featured separatamente
        const featuredInput = document.getElementById('editFeatured');
        if (featuredInput) {
            featuredInput.checked = car.featured || false;
        }
        
        // Salva l'ID dell'auto in modifica
        document.getElementById('editCarForm').dataset.carId = carId;
        this.openModal('editCarModal');
    }

    viewCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        const content = document.getElementById('viewCarContent');
        content.innerHTML = `
            <div class="car-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="car-images">
                    <div class="main-image" style="margin-bottom: 1rem;">
                        <img src="${car.images ? car.images[0] : car.image}" alt="${car.brand} ${car.model}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px;" />
                    </div>
                    ${car.images && car.images.length > 1 ? `
                        <div class="image-thumbnails" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            ${car.images.slice(1, 4).map(img => `
                                <img src="${img}" alt="Thumbnail" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px;" />
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="car-info">
                    <h3 style="color: var(--text-color); margin-bottom: 1rem; font-size: 1.5rem;">${car.brand} ${car.model}</h3>
                    <p class="car-price" style="color: var(--primary-color); font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem;">€${car.price.toLocaleString()}</p>
                    <div class="car-specs" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="spec-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span class="spec-label" style="color: var(--text-secondary);">Anno:</span>
                            <span class="spec-value" style="color: var(--text-color); font-weight: 500;">${car.year}</span>
                        </div>
                        <div class="spec-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span class="spec-label" style="color: var(--text-secondary);">Tipo:</span>
                            <span class="spec-value" style="color: var(--text-color); font-weight: 500;">${car.type}</span>
                        </div>
                        <div class="spec-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span class="spec-label" style="color: var(--text-secondary);">Carburante:</span>
                            <span class="spec-value" style="color: var(--text-color); font-weight: 500;">${car.fuel || 'N/A'}</span>
                        </div>
                        <div class="spec-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <span class="spec-label" style="color: var(--text-secondary);">Chilometri:</span>
                            <span class="spec-value" style="color: var(--text-color); font-weight: 500;">${car.km?.toLocaleString() || 'N/A'} km</span>
                        </div>
                    </div>
                    <div class="car-description">
                        <h4 style="color: var(--text-color); margin-bottom: 0.5rem;">Descrizione</h4>
                        <p style="color: var(--text-secondary); line-height: 1.6;">${car.description || 'Nessuna descrizione disponibile.'}</p>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal('viewCarModal');
    }

    // ===== GESTIONE IMMAGINI =====
    
    setupImageInputs() {
        const imageInputs = document.querySelectorAll('.image-url-input');
        
        imageInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                this.handleImageInput(e.target, index);
            });
            
            input.addEventListener('blur', (e) => {
                this.validateImageInput(e.target, index);
            });
        });
    }
    
    handleImageInput(input, index) {
        const url = input.value.trim();
        const preview = document.getElementById(`preview${index}`);
        
        if (url) {
            // Mostra loading
            preview.classList.add('loading');
            preview.innerHTML = '<div class="placeholder-text">⏳</div>';
            
            // Simula caricamento immagine
            setTimeout(() => {
                if (this.isValidImageUrl(url)) {
                    preview.innerHTML = `<img src="${url}" alt="Anteprima ${index + 1}" onerror="this.parentElement.innerHTML='<div class=\'placeholder-text\'>❌</div>'">`;
                    preview.classList.remove('loading');
                } else {
                    preview.innerHTML = '<div class="placeholder-text">❌</div>';
                    preview.classList.remove('loading');
                }
            }, 500);
        } else {
            preview.innerHTML = '<div class="placeholder-text">+</div>';
            preview.classList.remove('loading');
        }
    }
    
    validateImageInput(input, index) {
        const url = input.value.trim();
        
        if (url && !this.isValidImageUrl(url)) {
            input.setCustomValidity('Inserisci un URL immagine valido');
            this.showToast('⚠️ URL immagine non valido!', 'error');
        } else {
            input.setCustomValidity('');
        }
    }
    
    isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            const extension = urlObj.pathname.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            return validExtensions.includes(extension);
        } catch {
            return false;
        }
    }
    
    resetImagePreviews() {
        for (let i = 0; i < 5; i++) {
            const preview = document.getElementById(`preview${i}`);
            if (preview) {
                preview.innerHTML = '<div class="placeholder-text">+</div>';
            }
        }
    }

    // ===== UTILITY METHODS =====
    
    getRandomColor() {
        const colors = ['#00ff88', '#667eea', '#ff6b35', '#f093fb', '#4facfe', '#43e97b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    formatRole(role) {
        const roles = {
            admin: 'Amministratore',
            manager: 'Manager',
            editor: 'Editor',
            viewer: 'Visualizzatore'
        };
        return roles[role] || role;
    }

    formatStatus(status) {
        const statuses = {
            active: 'Attivo',
            inactive: 'Inattivo',
            pending: 'In Attesa'
        };
        return statuses[status] || status;
    }
    
    // ===== GESTIONE MODALI =====
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    toggleUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }
    
    closeUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Mostra il toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Rimuovi automaticamente dopo 5 secondi
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // ===== FILTRI E RICERCA =====
    
    filterCars(filter) {
        this.currentFilter = filter;
        
        // Aggiorna bottoni filtri
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
            
            this.renderCarsTable();
    }
}

// ===== FUNZIONI GLOBALI =====

let adminPanel;

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

// Funzioni globali per i pulsanti HTML
function openModal(modalId) {
    if (adminPanel) {
        adminPanel.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (adminPanel) {
        adminPanel.closeModal(modalId);
    }
}

function filterCars(filter) {
    if (adminPanel) {
        adminPanel.filterCars(filter);
    }
}

function showSection(sectionName) {
    if (adminPanel) {
        adminPanel.showSection(sectionName);
    }
}

function toggleUserMenu() {
    if (adminPanel) {
        adminPanel.toggleUserMenu();
    }
}

function logout() {
    if (adminPanel) {
        adminPanel.logout();
    }
}

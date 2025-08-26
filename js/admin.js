/**
 * Pannello Amministratore Wali Wheelse
 * Gestione completa del sito con funzionalità avanzate
 */

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.cars = [];
        this.users = [];
        this.orders = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDashboardData();
        this.showSection('dashboard');
        this.initSidebarToggle();
        this.initMobileMenu();
    }

    bindEvents() {
        // Navigazione sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
                this.updateActiveNav(item);
            });
        });

        // Toggle sidebar
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Menu toggle mobile
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Azioni rapide
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = card.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Form aggiungi auto
        document.getElementById('addCarBtn')?.addEventListener('click', () => {
            this.showAddCarModal();
        });

        document.getElementById('closeAddCarModal')?.addEventListener('click', () => {
            this.hideAddCarModal();
        });

        document.getElementById('cancelAddCar')?.addEventListener('click', () => {
            this.hideAddCarModal();
        });

        document.getElementById('addCarForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCar();
        });

        // Filtri auto
        document.getElementById('carSearch')?.addEventListener('input', (e) => {
            this.filterCars(e.target.value);
        });

        document.getElementById('brandFilter')?.addEventListener('change', (e) => {
            this.filterCarsByBrand(e.target.value);
        });

        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filterCarsByStatus(e.target.value);
        });

        // Notifiche e help
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showNotifications();
        });

        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.showHelp();
        });
    }

    showSection(sectionName) {
        // Nascondi tutte le sezioni
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostra la sezione selezionata
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            this.updatePageTitle(sectionName);
            this.loadSectionData(sectionName);
        }
    }

    updateActiveNav(activeItem) {
        // Rimuovi classe active da tutti gli elementi
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Aggiungi classe active all'elemento selezionato
        activeItem.classList.add('active');
    }

    updatePageTitle(sectionName) {
        const titles = {
            dashboard: 'Dashboard',
            cars: 'Gestione Auto',
            users: 'Gestione Utenti',
            orders: 'Gestione Ordini',
            analytics: 'Analytics',
            settings: 'Impostazioni'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle && titles[sectionName]) {
            pageTitle.textContent = titles[sectionName];
        }
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'cars':
                this.loadCarsData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    // === DASHBOARD ===
    loadDashboardData() {
        this.updateDashboardStats();
        this.loadRecentActivity();
    }

    updateDashboardStats() {
        // Simula dati reali (in produzione verrebbero da un'API)
        const stats = {
            totalCars: 156,
            totalUsers: 2847,
            totalOrders: 892,
            totalRevenue: 1547500
        };

        document.getElementById('totalCars').textContent = stats.totalCars;
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalRevenue').textContent = `€${stats.totalRevenue.toLocaleString()}`;
    }

    loadRecentActivity() {
        const activities = [
            {
                type: 'car_added',
                message: 'Nuova BMW X5 aggiunta al catalogo',
                time: '2 ore fa',
                icon: '🚗'
            },
            {
                type: 'order_completed',
                message: 'Ordine #1234 completato - Mercedes C200',
                time: '4 ore fa',
                icon: '✅'
            },
            {
                type: 'user_registered',
                message: 'Nuovo utente registrato: Mario Rossi',
                time: '6 ore fa',
                icon: '👤'
            },
            {
                type: 'payment_received',
                message: 'Pagamento ricevuto per Audi A4 - €45,000',
                time: '8 ore fa',
                icon: '💰'
            }
        ];

        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--admin-surface-hover); border-radius: 8px;">
                    <span style="font-size: 1.2rem;">${activity.icon}</span>
                    <div style="flex: 1;">
                        <p style="margin: 0; color: var(--admin-text); font-size: 0.9rem;">${activity.message}</p>
                        <small style="color: var(--admin-text-muted);">${activity.time}</small>
                    </div>
                </div>
            `).join('');
        }
    }

    // === GESTIONE AUTO ===
    loadCarsData() {
        // Prova a caricare auto da localStorage (pubblicate dall'admin)
        const savedCars = localStorage.getItem('publishedCars');
        
        if (savedCars) {
            this.cars = JSON.parse(savedCars);
            this.showToast('Auto caricate dal database locale', 'info');
        } else {
            // Dati di esempio se non ci sono auto salvate
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
                        'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/667eea/ffffff?text=BMW+X5',
                    status: 'active',
                    date: '2024-01-15',
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
                    status: 'active',
                    date: '2024-01-14',
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
                    power: 190,
                    mileage: 30000,
                    color: 'Daytona Gray',
                    description: 'Berlina compatta con motore diesel efficiente e design moderno',
                    features: ['Virtual Cockpit', 'MMI Navigation', 'LED Matrix', 'Sensori di Parcheggio'],
                    images: [
                        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4+1',
                        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=AUDI+A4',
                    status: 'active',
                    date: '2024-01-13',
                    location: 'Milano',
                    dealer: 'Audi Milano'
                },
                {
                    id: 4,
                    name: 'Porsche 911 Carrera',
                    brand: 'Porsche',
                    model: '911',
                    year: 2023,
                    price: 125000,
                    fuel: 'benzina',
                    transmission: 'automatico',
                    power: 450,
                    mileage: 5000,
                    color: 'GT Silver Metallic',
                    description: 'Iconica sportiva con prestazioni da supercar e finiture di lusso',
                    features: ['Sport Chrono Package', 'PASM', 'Porsche Communication Management', 'Sistema Audio Bose'],
                    images: [
                        'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911+1',
                        'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911+2'
                    ],
                    mainImage: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=PORSCHE+911',
                    status: 'draft',
                    date: '2024-01-12',
                    location: 'Milano',
                    dealer: 'Porsche Milano'
                }
            ];
            
            // Salva le auto di esempio
            this.saveCarsToStorage();
        }

        this.renderCarsTable();
    }

    renderCarsTable() {
        const tbody = document.getElementById('carsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.cars.map(car => `
            <tr>
                <td>
                    <img src="${car.mainImage || car.image || `https://via.placeholder.com/80x60/667eea/ffffff?text=${car.brand.toUpperCase()}`}" alt="${car.name}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
                </td>
                <td>
                    <strong>${car.name}</strong>
                    ${car.model ? `<br><small style="color: var(--admin-text-muted);">${car.model}</small>` : ''}
                </td>
                <td>
                    <span style="text-transform: capitalize;">${car.brand}</span>
                </td>
                <td>
                    <strong>€${car.price.toLocaleString()}</strong>
                    ${car.year ? `<br><small style="color: var(--admin-text-muted);">${car.year}</small>` : ''}
                </td>
                <td>
                    <span class="status-badge ${car.status}" style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        font-weight: 600;
                        background: ${car.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
                        color: ${car.status === 'active' ? '#10b981' : '#f59e0b'};
                        border: 1px solid ${car.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
                    ">
                        ${car.status === 'active' ? 'Attiva' : 'Bozza'}
                    </span>
                </td>
                <td>${new Date(car.date).toLocaleDateString('it-IT')}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon" onclick="adminPanel.editCar(${car.id})" title="Modifica">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="action-icon" onclick="adminPanel.deleteCar(${car.id})" title="Elimina">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterCars(searchTerm) {
        const filteredCars = this.cars.filter(car => 
            car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredCars(filteredCars);
    }

    filterCarsByBrand(brand) {
        if (!brand) {
            this.renderCarsTable();
            return;
        }
        const filteredCars = this.cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
        this.renderFilteredCars(filteredCars);
    }

    filterCarsByStatus(status) {
        if (!status) {
            this.renderCarsTable();
            return;
        }
        const filteredCars = this.cars.filter(car => car.status === status);
        this.renderFilteredCars(filteredCars);
    }

    renderFilteredCars(filteredCars) {
        const tbody = document.getElementById('carsTableBody');
        if (!tbody) return;

        if (filteredCars.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
                        Nessuna auto trovata con i filtri selezionati
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredCars.map(car => `
            <tr>
                <td>
                    <img src="${car.mainImage || car.image || `https://via.placeholder.com/80x60/667eea/ffffff?text=${car.brand.toUpperCase()}`}" alt="${car.name}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
                </td>
                <td>
                    <strong>${car.name}</strong>
                    ${car.model ? `<br><small style="color: var(--admin-text-muted);">${car.model}</small>` : ''}
                </td>
                <td>
                    <span style="text-transform: capitalize;">${car.brand}</span>
                </td>
                <td>
                    <strong>€${car.price.toLocaleString()}</strong>
                    ${car.year ? `<br><small style="color: var(--admin-text-muted);">${car.year}</small>` : ''}
                </td>
                <td>
                    <span class="status-badge ${car.status}" style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        font-weight: 600;
                        background: ${car.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
                        color: ${car.status === 'active' ? '#10b981' : '#f59e0b'};
                        border: 1px solid ${car.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
                    ">
                        ${car.status === 'active' ? 'Attiva' : 'Bozza'}
                    </span>
                </td>
                <td>${new Date(car.date).toLocaleDateString('it-IT')}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon" onclick="adminPanel.editCar(${car.id})" title="Modifica">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="action-icon" onclick="adminPanel.deleteCar(${car.id})" title="Elimina">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // === GESTIONE UTENTI ===
    loadUsersData() {
        // Simula dati utenti
        this.users = [
            {
                id: 1,
                name: 'Mario Rossi',
                email: 'mario.rossi@email.com',
                role: 'user',
                status: 'active',
                avatar: 'https://via.placeholder.com/40x40/667eea/ffffff?text=MR',
                registration: '2024-01-10'
            },
            {
                id: 2,
                name: 'Giulia Bianchi',
                email: 'giulia.bianchi@email.com',
                role: 'admin',
                status: 'active',
                avatar: 'https://via.placeholder.com/40x40/10b981/ffffff?text=GB',
                registration: '2024-01-08'
            }
        ];

        this.renderUsersTable();
    }

    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>
                    <img src="${user.avatar}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%;">
                </td>
                <td>
                    <strong>${user.name}</strong>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role}" style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        font-weight: 600;
                        background: ${user.role === 'admin' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
                        color: ${user.role === 'admin' ? '#667eea' : '#10b981'};
                        border: 1px solid ${user.role === 'admin' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
                    ">
                        ${user.role === 'admin' ? 'Amministratore' : 'Utente'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.status}" style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        font-weight: 600;
                        background: rgba(16, 185, 129, 0.1);
                        color: #10b981;
                        border: 1px solid rgba(16, 185, 129, 0.3);
                    ">
                        Attivo
                    </span>
                </td>
                <td>${new Date(user.registration).toLocaleDateString('it-IT')}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon" onclick="adminPanel.editUser(${user.id})" title="Modifica">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="action-icon" onclick="adminPanel.deleteUser(${user.id})" title="Elimina">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // === GESTIONE ORDINI ===
    loadOrdersData() {
        // Simula dati ordini
        this.orders = [
            {
                id: 'ORD-001',
                customer: 'Mario Rossi',
                car: 'BMW X5 xDrive40i',
                total: 85000,
                status: 'completed',
                date: '2024-01-15'
            },
            {
                id: 'ORD-002',
                customer: 'Giulia Bianchi',
                car: 'Mercedes-Benz C200 AMG',
                total: 52000,
                status: 'pending',
                date: '2024-01-14'
            }
        ];

        this.renderOrdersTable();
    }

    renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>
                    <strong>${order.id}</strong>
                </td>
                <td>${order.customer}</td>
                <td>${order.car}</td>
                <td>
                    <strong>€${order.total.toLocaleString()}</strong>
                </td>
                <td>
                    <span class="status-badge ${order.status}" style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        font-weight: 600;
                        background: ${order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
                        color: ${order.status === 'completed' ? '#10b981' : '#f59e0b'};
                        border: 1px solid ${order.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
                    ">
                        ${order.status === 'completed' ? 'Completato' : 'In attesa'}
                    </span>
                </td>
                <td>${new Date(order.date).toLocaleDateString('it-IT')}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon" onclick="adminPanel.viewOrder('${order.id}')" title="Visualizza">
                            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </button>
                        <button class="action-icon" onclick="adminPanel.editOrder('${order.id}')" title="Modifica">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // === ANALYTICS ===
    loadAnalyticsData() {
        // Placeholder per i grafici
        console.log('Caricamento analytics...');
    }

    // === SETTINGS ===
    loadSettingsData() {
        // Placeholder per le impostazioni
        console.log('Caricamento impostazioni...');
    }

    // === MODAL AGGIUNGI AUTO ===
    showAddCarModal() {
        const modal = document.getElementById('addCarModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideAddCarModal() {
        const modal = document.getElementById('addCarModal');
        if (modal) {
            modal.classList.remove('active');
            // Reset form
            document.getElementById('addCarForm')?.reset();
        }
    }

    handleAddCar() {
        const form = document.getElementById('addCarForm');
        if (!form) return;

        const formData = new FormData(form);
        const carData = {
            name: formData.get('carName'),
            brand: formData.get('brand'),
            price: parseFloat(formData.get('price')),
            year: parseInt(formData.get('year')),
            power: formData.get('power') ? parseInt(formData.get('power')) : null,
            fuel: formData.get('fuel'),
            description: formData.get('description'),
            imageUrl: formData.get('imageUrl')
        };

        // Validazione
        if (!carData.name || !carData.brand || !carData.price || !carData.year) {
            this.showToast('Compila tutti i campi obbligatori', 'error');
            return;
        }

        // Crea nuova auto con tutti i campi necessari per il sito
        const newCar = {
            id: Date.now(), // ID univoco basato su timestamp
            name: carData.name,
            brand: carData.brand,
            model: carData.name.split(' ').slice(1).join(' ') || carData.brand, // Estrae il modello dal nome
            year: carData.year,
            price: carData.price,
            fuel: carData.fuel,
            transmission: 'automatico', // Default
            power: carData.power || 150, // Default se non specificato
            mileage: 0, // Nuova auto
            color: 'Non specificato',
            description: carData.description || 'Auto di qualità con prestazioni eccellenti',
            features: ['Navigazione', 'Cruise Control', 'Sistema Audio'], // Caratteristiche base
            images: [
                carData.imageUrl || `https://via.placeholder.com/400x300/667eea/ffffff?text=${carData.brand.toUpperCase()}`
            ],
            mainImage: carData.imageUrl || `https://via.placeholder.com/400x300/667eea/ffffff?text=${carData.brand.toUpperCase()}`,
            status: 'active', // Cambiato da 'available' a 'active' per essere visibile sul sito
            date: new Date().toISOString().split('T')[0],
            location: 'Milano', // Default
            dealer: 'Wali Wheelse'
        };

        // Aggiungi alla lista locale
        this.cars.unshift(newCar);
        
        // Salva in localStorage per sincronizzazione con il sito
        this.saveCarsToStorage();
        
        // Aggiorna l'interfaccia
        this.renderCarsTable();
        this.hideAddCarModal();
        this.showToast('Auto pubblicata con successo! Ora è visibile nel catalogo del sito!', 'success');
        this.updateDashboardStats();
    }

    saveCarsToStorage() {
        console.log('=== SALVATAGGIO AUTO IN STORAGE ===');
        console.log('Auto totali nell\'admin:', this.cars);
        console.log('Auto con status active/available:', this.cars.filter(car => car.status === 'active' || car.status === 'available'));
        
        // Salva le auto in localStorage per sincronizzazione con il sito principale
        localStorage.setItem('publishedCars', JSON.stringify(this.cars));
        console.log('✅ Salvato in publishedCars:', this.cars.length, 'auto');
        
        // Salva le auto disponibili per il catalogo (sia 'active' che 'available')
        const siteCars = this.cars.filter(car => car.status === 'active' || car.status === 'available');
        console.log('✅ Salvo in siteCars:', siteCars.length, 'auto con status active/available');
        console.log('Dettagli auto salvate in siteCars:', siteCars);
        localStorage.setItem('siteCars', JSON.stringify(siteCars));
        
        // Verifica che sia stato salvato correttamente
        const savedSiteCars = localStorage.getItem('siteCars');
        console.log('✅ Verifica - siteCars salvato:', savedSiteCars);
        
        try {
            const parsedCars = JSON.parse(savedSiteCars);
            console.log('✅ Verifica - siteCars parsato:', parsedCars);
            console.log('✅ Verifica - Numero auto parsate:', parsedCars.length);
        } catch (e) {
            console.error('❌ Errore parsing siteCars salvato:', e);
        }
        
        this.showToast('Auto sincronizzate con il sito principale!', 'info');
        
        // Test immediato di sincronizzazione
        this.testSynchronization();
    }

    testSynchronization() {
        console.log('=== TEST SINCRONIZZAZIONE ===');
        console.log('Auto totali nell\'admin:', this.cars.length);
        console.log('Auto con status active/available:', this.cars.filter(car => car.status === 'active' || car.status === 'available').length);
        console.log('Contenuto di publishedCars:', localStorage.getItem('publishedCars'));
        console.log('Contenuto di siteCars:', localStorage.getItem('siteCars'));
        
        // Forza la sincronizzazione
        this.saveCarsToStorage();
        
        this.showToast('Test di sincronizzazione completato! Controlla la console per i dettagli.', 'info');
    }

    clearStorageAndReset() {
        console.log('=== PULIZIA STORAGE E RESET ===');
        
        // Pulisci localStorage
        localStorage.removeItem('publishedCars');
        localStorage.removeItem('siteCars');
        
        // Ricarica i dati di esempio
        this.loadCarsData();
        
        this.showToast('Storage pulito e dati di esempio ricaricati!', 'info');
    }

    // === AZIONI RAPIDE ===
    handleQuickAction(action) {
        switch (action) {
            case 'addCar':
                this.showAddCarModal();
                break;
            case 'manageUsers':
                this.showSection('users');
                break;
            case 'viewOrders':
                this.showSection('orders');
                break;
            case 'analytics':
                this.showSection('analytics');
                break;
            case 'testSync':
                this.testSynchronization();
                break;
            case 'clearStorage':
                this.clearStorageAndReset();
                break;
        }
    }

    // === SIDEBAR TOGGLE ===
    toggleSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    initSidebarToggle() {
        // Toggle automatico su schermi piccoli
        if (window.innerWidth <= 1200) {
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) {
                sidebar.classList.add('collapsed');
            }
        }
    }

    // === MOBILE MENU ===
    toggleMobileMenu() {
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    initMobileMenu() {
        // Chiudi menu mobile quando si clicca fuori
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.admin-sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (sidebar && menuToggle && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    // === FUNZIONI UTILITY ===
    editCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            this.showToast(`Modifica auto: ${car.name}`, 'info');
            // Qui si aprirebbe un modal di modifica
        }
    }

    deleteCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car && confirm(`Sei sicuro di voler eliminare ${car.name}?`)) {
            this.cars = this.cars.filter(c => c.id !== carId);
            
            // Aggiorna localStorage
            this.saveCarsToStorage();
            
            this.renderCarsTable();
            this.showToast('Auto eliminata con successo e rimossa dal catalogo del sito', 'success');
            this.updateDashboardStats();
        }
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Modifica utente: ${user.name}`, 'info');
        }
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user && confirm(`Sei sicuro di voler eliminare ${user.name}?`)) {
            this.users = this.users.filter(u => u.id !== userId);
            this.renderUsersTable();
            this.showToast('Utente eliminato con successo', 'success');
        }
    }

    viewOrder(orderId) {
        this.showToast(`Visualizza ordine: ${orderId}`, 'info');
    }

    editOrder(orderId) {
        this.showToast(`Modifica ordine: ${orderId}`, 'info');
    }

    showNotifications() {
        this.showToast('Hai 3 notifiche non lette', 'info');
    }

    showHelp() {
        this.showToast('Centro assistenza aperto', 'info');
    }

    logout() {
        if (confirm('Sei sicuro di voler effettuare il logout?')) {
            this.showToast('Logout effettuato', 'info');
            // Qui si reindirizzerebbe alla pagina di login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    showToast(message, type = 'info') {
        // Crea un toast temporaneo
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
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

        // Anima l'entrata
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Inizializza il pannello amministratore quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Gestione responsive
window.addEventListener('resize', () => {
    if (window.adminPanel) {
        adminPanel.initSidebarToggle();
    }
});

// Sistema di Prenotazione Test Drive - Wali Wheelse
class TestDriveBooking {
    constructor() {
        this.availableSlots = this.generateTimeSlots();
        this.selectedCar = null;
        this.selectedSlot = null;
        this.init();
    }

    init() {
        this.createBookingModal();
        this.bindEvents();
    }

    generateTimeSlots() {
        const slots = [];
        const startHour = 9;
        const endHour = 18;
        const days = ['Oggi', 'Domani', 'Dopo domani'];
        
        days.forEach((day, dayIndex) => {
            for (let hour = startHour; hour < endHour; hour++) {
                if (hour === 12) continue; // Pausa pranzo
                
                const time = `${hour.toString().padStart(2, '0')}:00`;
                const available = Math.random() > 0.3; // 70% di disponibilità
                
                slots.push({
                    day: day,
                    dayIndex: dayIndex,
                    time: time,
                    hour: hour,
                    available: available,
                    id: `${dayIndex}-${hour}`
                });
            }
        });
        
        return slots;
    }

    createBookingModal() {
        const modalHTML = `
            <div class="test-drive-modal" id="testDriveModal">
                <div class="modal-overlay" id="testDriveOverlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🚗 Prenota il tuo Test Drive</h2>
                        <button class="modal-close" id="testDriveClose">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Step 1: Selezione Auto -->
                        <div class="booking-step active" id="step1">
                            <h3>1. Scegli l'Auto</h3>
                            <p>Seleziona l'auto che vuoi provare</p>
                            
                            <div class="car-selection-grid" id="carSelectionGrid">
                                <!-- Le auto verranno caricate dinamicamente -->
                            </div>
                        </div>
                        
                        <!-- Step 2: Selezione Orario -->
                        <div class="booking-step" id="step2">
                            <h3>2. Scegli l'Orario</h3>
                            <p>Seleziona data e orario per il test drive</p>
                            
                            <div class="time-slots-container">
                                <div class="date-navigation">
                                    <button class="date-nav-btn" id="prevDate">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                        </svg>
                                    </button>
                                    <span class="current-date" id="currentDate">Oggi</span>
                                    <button class="date-nav-btn" id="nextDate">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="time-slots-grid" id="timeSlotsGrid">
                                    <!-- Gli slot orari verranno generati dinamicamente -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 3: Dati Personali -->
                        <div class="booking-step" id="step3">
                            <h3>3. I tuoi Dati</h3>
                            <p>Compila i tuoi dati per confermare la prenotazione</p>
                            
                            <form class="booking-form" id="bookingForm">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="firstName">Nome *</label>
                                        <input type="text" id="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Cognome *</label>
                                        <input type="text" id="lastName" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email">Email *</label>
                                        <input type="email" id="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Telefono *</label>
                                        <input type="tel" id="phone" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="license">Patente di Guida *</label>
                                    <select id="license" required>
                                        <option value="">Seleziona tipo patente</option>
                                        <option value="B">B - Auto</option>
                                        <option value="A">A - Moto</option>
                                        <option value="C">C - Camion</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="experience">Esperienza di Guida</label>
                                    <select id="experience">
                                        <option value="">Seleziona esperienza</option>
                                        <option value="beginner">Principiante (0-2 anni)</option>
                                        <option value="intermediate">Intermedio (3-5 anni)</option>
                                        <option value="advanced">Esperto (5+ anni)</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="notes">Note Speciali</label>
                                    <textarea id="notes" rows="3" placeholder="Hai richieste particolari per il test drive?"></textarea>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Step 4: Conferma -->
                        <div class="booking-step" id="step4">
                            <h3>4. Conferma Prenotazione</h3>
                            <p>Rivedi i dettagli e conferma la prenotazione</p>
                            
                            <div class="booking-summary" id="bookingSummary">
                                <!-- Il riepilogo verrà generato dinamicamente -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="step-indicators">
                            <div class="step-indicator active" data-step="1">1</div>
                            <div class="step-indicator" data-step="2">2</div>
                            <div class="step-indicator" data-step="3">3</div>
                            <div class="step-indicator" data-step="4">4</div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-secondary" id="prevStep" style="display: none;">
                                <svg viewBox="0 0 24 24">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                </svg>
                                Indietro
                            </button>
                            <button class="btn-primary" id="nextStep">
                                Avanti
                                <svg viewBox="0 0 24 24">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                </svg>
                            </button>
                            <button class="btn-success" id="confirmBooking" style="display: none;">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Conferma Prenotazione
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        const modal = document.getElementById('testDriveModal');
        const overlay = document.getElementById('testDriveOverlay');
        const close = document.getElementById('testDriveClose');
        const nextStep = document.getElementById('nextStep');
        const prevStep = document.getElementById('prevStep');
        const confirmBooking = document.getElementById('confirmBooking');

        // Chiudi modal
        [overlay, close].forEach(element => {
            element.addEventListener('click', () => this.closeModal());
        });

        // Navigazione step
        nextStep.addEventListener('click', () => this.nextStep());
        prevStep.addEventListener('click', () => this.prevStep());
        confirmBooking.addEventListener('click', () => this.confirmBooking());

        // Navigazione date
        document.getElementById('prevDate').addEventListener('click', () => this.navigateDate(-1));
        document.getElementById('nextDate').addEventListener('click', () => this.navigateDate(1));

        // Previeni chiusura cliccando sul contenuto
        modal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());
    }

    openModal() {
        document.getElementById('testDriveModal').classList.add('open');
        document.body.style.overflow = 'hidden';
        this.loadCars();
        this.currentStep = 1;
        this.updateStepIndicators();
    }

    closeModal() {
        document.getElementById('testDriveModal').classList.remove('open');
        document.body.style.overflow = '';
        this.resetForm();
    }

    loadCars() {
        const grid = document.getElementById('carSelectionGrid');
        grid.innerHTML = '';

        // Carica auto dal database globale
        if (window.carsDatabase) {
            window.carsDatabase.slice(0, 6).forEach(car => {
                const carCard = this.createCarCard(car);
                grid.appendChild(carCard);
            });
        } else {
            // Fallback con auto di esempio
            const sampleCars = [
                { id: 1, titolo: 'Mercedes-AMG GT 2024', marca: 'Mercedes-Benz', prezzo: 185000, categoria: 'sportiva' },
                { id: 2, titolo: 'BMW X7 M60i 2024', marca: 'BMW', prezzo: 165000, categoria: 'suv' },
                { id: 3, titolo: 'Porsche 911 Carrera', marca: 'Porsche', prezzo: 145000, categoria: 'sportiva' }
            ];

            sampleCars.forEach(car => {
                const carCard = this.createCarCard(car);
                grid.appendChild(carCard);
            });
        }
    }

    createCarCard(car) {
        const card = document.createElement('div');
        card.className = 'car-selection-card';
        card.dataset.carId = car.id;
        
        card.innerHTML = `
            <div class="car-card-image">
                <div class="car-category-badge ${car.categoria}">${car.categoria}</div>
            </div>
            <div class="car-card-info">
                <h4>${car.titolo}</h4>
                <p class="car-brand">${car.marca}</p>
                <p class="car-price">€${car.prezzo.toLocaleString('it-IT')}</p>
            </div>
            <div class="car-card-select">
                <div class="select-indicator"></div>
            </div>
        `;

        card.addEventListener('click', () => this.selectCar(car, card));
        return card;
    }

    selectCar(car, card) {
        // Rimuovi selezione precedente
        document.querySelectorAll('.car-selection-card').forEach(c => c.classList.remove('selected'));
        
        // Seleziona nuova auto
        card.classList.add('selected');
        this.selectedCar = car;
        
        // Abilita pulsante avanti
        document.getElementById('nextStep').disabled = false;
    }

    nextStep() {
        if (this.currentStep < 4) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateStepIndicators();
                this.showCurrentStep();
                this.updateNavigationButtons();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepIndicators();
            this.showCurrentStep();
            this.updateNavigationButtons();
        }
    }

    validateCurrentStep() {
        switch(this.currentStep) {
            case 1:
                if (!this.selectedCar) {
                    this.showError('Seleziona un\'auto per continuare');
                    return false;
                }
                break;
            case 2:
                if (!this.selectedSlot) {
                    this.showError('Seleziona un orario per continuare');
                    return false;
                }
                break;
            case 3:
                const form = document.getElementById('bookingForm');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }
                break;
        }
        return true;
    }

    showCurrentStep() {
        // Nascondi tutti gli step
        document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
        
        // Mostra step corrente
        document.getElementById(`step${this.currentStep}`).classList.add('active');
        
        // Carica contenuto specifico per step
        switch(this.currentStep) {
            case 2:
                this.loadTimeSlots();
                break;
            case 4:
                this.generateBookingSummary();
                break;
        }
    }

    loadTimeSlots() {
        const grid = document.getElementById('timeSlotsGrid');
        grid.innerHTML = '';
        
        this.availableSlots.forEach(slot => {
            const slotElement = this.createTimeSlot(slot);
            grid.appendChild(slotElement);
        });
    }

    createTimeSlot(slot) {
        const slotElement = document.createElement('div');
        slotElement.className = `time-slot ${slot.available ? 'available' : 'unavailable'}`;
        slotElement.dataset.slotId = slot.id;
        
        slotElement.innerHTML = `
            <div class="slot-time">${slot.time}</div>
            <div class="slot-status">${slot.available ? 'Disponibile' : 'Occupato'}</div>
        `;
        
        if (slot.available) {
            slotElement.addEventListener('click', () => this.selectTimeSlot(slot, slotElement));
        }
        
        return slotElement;
    }

    selectTimeSlot(slot, element) {
        // Rimuovi selezione precedente
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        
        // Seleziona nuovo slot
        element.classList.add('selected');
        this.selectedSlot = slot;
        
        // Aggiorna data corrente
        document.getElementById('currentDate').textContent = slot.day;
    }

    navigateDate(direction) {
        // Implementazione navigazione date
        const currentDateElement = document.getElementById('currentDate');
        const currentText = currentDateElement.textContent;
        
        const dates = ['Oggi', 'Domani', 'Dopo domani'];
        let currentIndex = dates.indexOf(currentText);
        
        currentIndex = (currentIndex + direction + dates.length) % dates.length;
        currentDateElement.textContent = dates[currentIndex];
        
        // Ricarica slot per la nuova data
        this.loadTimeSlots();
    }

    generateBookingSummary() {
        const summary = document.getElementById('bookingSummary');
        const form = document.getElementById('bookingForm');
        const formData = new FormData(form);
        
        const summaryHTML = `
            <div class="summary-section">
                <h4>🚗 Auto Selezionata</h4>
                <div class="summary-item">
                    <span class="summary-label">Modello:</span>
                    <span class="summary-value">${this.selectedCar.titolo}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Marca:</span>
                    <span class="summary-value">${this.selectedCar.marca}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Categoria:</span>
                    <span class="summary-value">${this.selectedCar.categoria}</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>📅 Appuntamento</h4>
                <div class="summary-item">
                    <span class="summary-label">Data:</span>
                    <span class="summary-value">${this.selectedSlot.day}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Orario:</span>
                    <span class="summary-value">${this.selectedSlot.time}</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>👤 I tuoi Dati</h4>
                <div class="summary-item">
                    <span class="summary-label">Nome:</span>
                    <span class="summary-value">${formData.get('firstName')} ${formData.get('lastName')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Email:</span>
                    <span class="summary-value">${formData.get('email')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Telefono:</span>
                    <span class="summary-value">${formData.get('phone')}</span>
                </div>
            </div>
            
            <div class="summary-note">
                <p>📝 <strong>Nota:</strong> Ti invieremo una conferma via email e ti ricontatteremo per confermare l'appuntamento.</p>
            </div>
        `;
        
        summary.innerHTML = summaryHTML;
    }

    updateStepIndicators() {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index + 1 <= this.currentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const confirmBtn = document.getElementById('confirmBooking');
        
        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.currentStep < 4 ? 'flex' : 'none';
        confirmBtn.style.display = this.currentStep === 4 ? 'flex' : 'none';
    }

    async confirmBooking() {
        const form = document.getElementById('bookingForm');
        const formData = new FormData(form);
        
        // Simula invio dati
        const loadingBtn = document.getElementById('confirmBooking');
        const originalText = loadingBtn.innerHTML;
        
        loadingBtn.innerHTML = '<svg class="loading-spinner" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-7.35 16.76l1.49-1.49A8 8 0 1 1 12 20a8 8 0 0 1-5.86-2.73l-1.49 1.49A10 10 0 1 0 12 2z"/></svg> Prenotazione in corso...';
        loadingBtn.disabled = true;
        
        try {
            // Simula chiamata API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mostra conferma
            this.showSuccessMessage();
            
            // Chiudi modal dopo 3 secondi
            setTimeout(() => this.closeModal(), 3000);
            
        } catch (error) {
            this.showError('Errore durante la prenotazione. Riprova.');
            loadingBtn.innerHTML = originalText;
            loadingBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✅</div>
                <h3>Prenotazione Confermata!</h3>
                <p>Il tuo test drive è stato prenotato con successo.</p>
                <p>Ti abbiamo inviato una conferma via email con tutti i dettagli.</p>
                <div class="success-details">
                    <p><strong>Auto:</strong> ${this.selectedCar.titolo}</p>
                    <p><strong>Data:</strong> ${this.selectedSlot.day} alle ${this.selectedSlot.time}</p>
                    <p><strong>Luogo:</strong> Showroom Wali Wheelse - Via Roma 123, Milano</p>
                </div>
            </div>
        `;
    }

    showError(message) {
        // Implementa notifica errore
        console.error(message);
        // Qui potresti usare un toast o notifica
    }

    resetForm() {
        this.selectedCar = null;
        this.selectedSlot = null;
        this.currentStep = 1;
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Reset step
        document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        
        // Reset indicatori
        this.updateStepIndicators();
        this.updateNavigationButtons();
        
        // Reset selezione auto
        document.querySelectorAll('.car-selection-card').forEach(card => card.classList.remove('selected'));
        
        // Reset selezione orario
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    }
}

// Inizializza il sistema di prenotazione
document.addEventListener('DOMContentLoaded', () => {
    window.testDriveBooking = new TestDriveBooking();
});

// Esporta per uso esterno
window.TestDriveBooking = TestDriveBooking;

// ===== ENHANCED FINANCING CALCULATOR =====

class FinancingCalculator {
    constructor() {
        this.carPriceInput = document.getElementById('carPrice');
        this.downPaymentInput = document.getElementById('downPayment');
        this.loanTermSelect = document.getElementById('loanTerm');
        this.interestRateInput = document.getElementById('interestRate');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.quoteForm = document.querySelector('.quote-form');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupKeyboardShortcuts();
        this.loadSavedData();
    }

    setupEventListeners() {
        // Real-time calculation on input change
        [this.carPriceInput, this.downPaymentInput, this.loanTermSelect, this.interestRateInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.debounceCalculation();
                });
            }
        });

        // Calculate button
        if (this.calculateBtn) {
            this.calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculateLoan();
            });
        }

        // Quote form submission
        if (this.quoteForm) {
            this.quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuoteSubmission();
            });
        }

        // Auto-save data
        [this.carPriceInput, this.downPaymentInput, this.loanTermSelect, this.interestRateInput].forEach(input => {
            if (input) {
                input.addEventListener('change', () => {
                    this.saveData();
                });
            }
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input, .form-select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = parseFloat(field.value) || 0;
        const fieldName = field.name || field.id;
        
        this.clearFieldError(field);
        
        if (field.required && value <= 0) {
            this.showFieldError(field, 'Questo campo è obbligatorio');
            return false;
        }

        switch(fieldName) {
            case 'carPrice':
                if (value < 1000) {
                    this.showFieldError(field, 'Il prezzo minimo è €1.000');
                    return false;
                }
                if (value > 1000000) {
                    this.showFieldError(field, 'Il prezzo massimo è €1.000.000');
                    return false;
                }
                break;
            case 'downPayment':
                if (value < 0) {
                    this.showFieldError(field, 'L\'acconto non può essere negativo');
                    return false;
                }
                break;
            case 'interestRate':
                if (value < 0.1) {
                    this.showFieldError(field, 'Il tasso minimo è 0.1%');
                    return false;
                }
                if (value > 20) {
                    this.showFieldError(field, 'Il tasso massimo è 20%');
                    return false;
                }
                break;
        }

        this.showFieldSuccess(field);
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = 'rgba(255, 107, 107, 0.5)';
        field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.2)';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.style.borderColor = 'rgba(0, 255, 136, 0.5)';
        field.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    debounceCalculation() {
        clearTimeout(this.calculationTimeout);
        this.calculationTimeout = setTimeout(() => {
            this.calculateLoan();
        }, 500);
    }

    calculateLoan() {
        const carPrice = parseFloat(this.carPriceInput?.value) || 0;
        const downPayment = parseFloat(this.downPaymentInput?.value) || 0;
        const loanTerm = parseInt(this.loanTermSelect?.value) || 5;
        const interestRate = parseFloat(this.interestRateInput?.value) || 3.5;

        // Validate inputs
        if (carPrice <= 0) {
            this.showToast('Inserisci un prezzo auto valido', 'error');
            return;
        }

        if (downPayment < 0) {
            this.showToast('L\'acconto non può essere negativo', 'error');
            return;
        }

        if (downPayment >= carPrice) {
            this.showToast('L\'acconto deve essere inferiore al prezzo dell\'auto', 'error');
            return;
        }

        const loanAmount = carPrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (loanAmount <= 0) {
            this.showToast('L\'importo del prestito deve essere maggiore di zero', 'error');
            return;
        }

        // Calculate monthly payment using the standard loan formula
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                             (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        const totalCost = monthlyPayment * numberOfPayments;
        const totalInterest = totalCost - loanAmount;

        // Update results with animation
        this.updateResults({
            loanAmount,
            monthlyPayment,
            totalInterest,
            totalCost
        });

        // Add success animation
        this.animateSuccess();
        
        // Save calculation to history
        this.saveCalculation({
            carPrice,
            downPayment,
            loanTerm,
            interestRate,
            loanAmount,
            monthlyPayment,
            totalInterest,
            totalCost,
            timestamp: new Date().toISOString()
        });
    }

    updateResults(results) {
        const { loanAmount, monthlyPayment, totalInterest, totalCost } = results;
        
        // Animate numbers
        this.animateNumber('loanAmount', loanAmount);
        this.animateNumber('monthlyPayment', monthlyPayment);
        this.animateNumber('totalInterest', totalInterest);
        this.animateNumber('totalCost', totalCost);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
            
            element.textContent = `€${Math.round(currentValue).toLocaleString('it-IT')}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    animateSuccess() {
        const resultsContainer = document.querySelector('.calculator-results');
        if (resultsContainer) {
            resultsContainer.classList.add('calculation-success');
            setTimeout(() => {
                resultsContainer.classList.remove('calculation-success');
            }, 600);
        }

        // Create success particles
        this.createSuccessParticles();
    }

    createSuccessParticles() {
        const container = document.querySelector('.calculator-container');
        if (!container) return;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = Math.random() * container.offsetWidth;
            const startY = Math.random() * container.offsetHeight;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            container.appendChild(particle);
            
            particle.animate([
                { transform: 'scale(0) translateY(0px)', opacity: 1 },
                { transform: 'scale(1) translateY(-100px)', opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    async handleQuoteSubmission() {
        const formData = new FormData(this.quoteForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const inputs = this.quoteForm.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showToast('Correggi gli errori nel form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Invio richiesta...</span>';
        submitBtn.disabled = true;
        
        try {
            await this.simulateAPICall();
            this.showToast('Richiesta inviata con successo! Ti contatteremo entro 24 ore.', 'success');
            this.quoteForm.reset();
        } catch (error) {
            this.showToast('Errore durante l\'invio della richiesta', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 2000);
        });
    }

    saveData() {
        const data = {
            carPrice: this.carPriceInput?.value || '',
            downPayment: this.downPaymentInput?.value || '',
            loanTerm: this.loanTermSelect?.value || '',
            interestRate: this.interestRateInput?.value || ''
        };
        
        localStorage.setItem('financingCalculatorData', JSON.stringify(data));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('financingCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (this.carPriceInput) this.carPriceInput.value = data.carPrice;
                if (this.downPaymentInput) this.downPaymentInput.value = data.downPayment;
                if (this.loanTermSelect) this.loanTermSelect.value = data.loanTerm;
                if (this.interestRateInput) this.interestRateInput.value = data.interestRate;
                
                // Calculate with saved data
                if (data.carPrice) {
                    setTimeout(() => this.calculateLoan(), 500);
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    saveCalculation(calculation) {
        const history = JSON.parse(localStorage.getItem('financingHistory') || '[]');
        history.unshift(calculation);
        
        // Keep only last 10 calculations
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem('financingHistory', JSON.stringify(history));
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to calculate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.calculateLoan();
            }
            
            // R to reset form
            if (e.key === 'r' || e.key === 'R') {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetForm();
                }
            }
        });
    }

    resetForm() {
        if (confirm('Sei sicuro di voler ripristinare tutti i valori?')) {
            if (this.carPriceInput) this.carPriceInput.value = '';
            if (this.downPaymentInput) this.downPaymentInput.value = '';
            if (this.loanTermSelect) this.loanTermSelect.value = '5';
            if (this.interestRateInput) this.interestRateInput.value = '3.5';
            
            // Clear results
            document.getElementById('loanAmount').textContent = '€0';
            document.getElementById('monthlyPayment').textContent = '€0';
            document.getElementById('totalInterest').textContent = '€0';
            document.getElementById('totalCost').textContent = '€0';
            
            // Clear saved data
            localStorage.removeItem('financingCalculatorData');
            
            this.showToast('Form ripristinato', 'info');
        }
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#00cc6a'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            word-wrap: break-word;
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
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financingCalculator = new FinancingCalculator();
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 1rem; border-radius: 10px; font-size: 0.8rem; z-index: 1000;">
            <strong>Scorciatoie:</strong><br>
            Ctrl/Cmd + Enter - Calcola<br>
            Ctrl/Cmd + R - Reset<br>
            Calcolo automatico in tempo reale
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

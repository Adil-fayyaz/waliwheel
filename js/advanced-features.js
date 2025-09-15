/**
 * Advanced Features Manager - Modern Website Functionality
 * Handles all advanced UI components and interactions
 */

class AdvancedFeatures {
    constructor() {
        this.notifications = [];
        this.searchCache = new Map();
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
    }

    // ===== NOTIFICATION SYSTEM =====
    
    showNotification(title, message, type = 'info', duration = 5000) {
        const id = Date.now().toString();
        const notification = this.createNotificationElement(id, title, message, type);
        
        document.body.appendChild(notification);
        
        // Show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(id);
        }, duration);
        
        this.notifications.push({ id, element: notification });
        return id;
    }
    
    createNotificationElement(id, title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-notification-id', id);
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type] || icons.info}</div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="advancedFeatures.removeNotification('${id}')">&times;</button>
            </div>
        `;
        
        return notification;
    }
    
    removeNotification(id) {
        const notification = document.querySelector(`[data-notification-id="${id}"]`);
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }

    // ===== ADVANCED SEARCH =====
    
    setupAdvancedSearch(inputElement, suggestionsContainer, searchCallback) {
        let searchTimeout;
        
        inputElement.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.hideSuggestions(suggestionsContainer);
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.performSearch(query, suggestionsContainer, searchCallback);
            }, 300);
        });
        
        inputElement.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSuggestions(suggestionsContainer);
            }, 200);
        });
        
        inputElement.addEventListener('focus', () => {
            if (inputElement.value.trim().length >= 2) {
                this.performSearch(inputElement.value.trim(), suggestionsContainer, searchCallback);
            }
        });
    }
    
    performSearch(query, container, callback) {
        // Check cache first
        if (this.searchCache.has(query)) {
            this.showSuggestions(container, this.searchCache.get(query));
            return;
        }
        
        // Show loading
        this.showLoadingSuggestions(container);
        
        // Simulate API call or perform actual search
        setTimeout(() => {
            const results = callback(query);
            this.searchCache.set(query, results);
            this.showSuggestions(container, results);
        }, 200);
    }
    
    showLoadingSuggestions(container) {
        container.innerHTML = `
            <div class="suggestion-item">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        container.classList.add('show');
    }
    
    showSuggestions(container, suggestions) {
        if (!suggestions || suggestions.length === 0) {
            container.innerHTML = '<div class="suggestion-item">Nessun risultato trovato</div>';
        } else {
            container.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="advancedFeatures.selectSuggestion('${suggestion.value}')">
                    ${suggestion.label}
                </div>
            `).join('');
        }
        container.classList.add('show');
    }
    
    hideSuggestions(container) {
        container.classList.remove('show');
    }
    
    selectSuggestion(value) {
        // Handle suggestion selection
        console.log('Selected suggestion:', value);
    }

    // ===== LOADING STATES =====
    
    showLoadingSpinner(element) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.setAttribute('data-loading', 'true');
        
        element.appendChild(spinner);
        this.isLoading = true;
    }
    
    hideLoadingSpinner(element) {
        const spinner = element.querySelector('[data-loading="true"]');
        if (spinner) {
            spinner.remove();
        }
        this.isLoading = false;
    }
    
    showSkeletonLoading(container, count = 3) {
        const skeletons = Array.from({ length: count }, () => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 70%;"></div>
            </div>
        `).join('');
        
        container.innerHTML = skeletons;
    }

    // ===== ADVANCED PAGINATION =====
    
    createPagination(container, totalItems, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination advanced">';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                    onclick="advancedFeatures.goToPage(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                ←
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="advancedFeatures.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="advancedFeatures.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
            paginationHTML += `<button class="pagination-btn" onclick="advancedFeatures.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="advancedFeatures.goToPage(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                →
            </button>
        `;
        
        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        if (this.isLoading) return;
        
        this.currentPage = page;
        // Trigger page change event
        document.dispatchEvent(new CustomEvent('pageChange', {
            detail: { page: page, itemsPerPage: this.itemsPerPage }
        }));
    }

    // ===== ADVANCED TABS =====
    
    initializeTabs(tabsContainer) {
        const tabs = tabsContainer.querySelectorAll('.tab.advanced');
        const indicator = document.createElement('div');
        indicator.className = 'tab-indicator';
        tabsContainer.appendChild(indicator);
        
        // Set initial position
        const activeTab = tabsContainer.querySelector('.tab.advanced.active') || tabs[0];
        this.updateTabIndicator(activeTab, indicator);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update indicator position
                this.updateTabIndicator(tab, indicator);
                
                // Trigger tab change event
                const tabId = tab.getAttribute('data-tab');
                document.dispatchEvent(new CustomEvent('tabChange', {
                    detail: { tabId: tabId, tab: tab }
                }));
            });
        });
    }
    
    updateTabIndicator(activeTab, indicator) {
        const rect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentNode.getBoundingClientRect();
        
        indicator.style.left = `${activeTab.offsetLeft}px`;
        indicator.style.width = `${activeTab.offsetWidth}px`;
    }

    // ===== ADVANCED FORMS =====
    
    enhanceForm(formElement) {
        const inputs = formElement.querySelectorAll('.form-input.advanced');
        
        inputs.forEach(input => {
            // Add floating label functionality
            this.setupFloatingLabel(input);
            
            // Add validation
            this.setupFieldValidation(input);
            
            // Add auto-save
            this.setupAutoSave(input);
        });
    }
    
    setupFloatingLabel(input) {
        const updateLabel = () => {
            const label = input.nextElementSibling;
            if (label && label.classList.contains('form-label')) {
                if (input.value || input === document.activeElement) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        };
        
        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
        
        // Initial check
        updateLabel();
    }
    
    setupFieldValidation(input) {
        input.addEventListener('blur', () => {
            this.validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear error state on input
            input.classList.remove('error');
            const errorMsg = input.parentNode.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'Questo campo è obbligatorio';
        }
        
        // Email validation
        else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Inserisci un indirizzo email valido';
        }
        
        // Phone validation
        else if (input.name === 'phone' && value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
            isValid = false;
            errorMessage = 'Inserisci un numero di telefono valido';
        }
        
        // Password strength
        else if (type === 'password' && value && value.length < 8) {
            isValid = false;
            errorMessage = 'La password deve essere di almeno 8 caratteri';
        }
        
        this.showFieldValidation(input, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(input, isValid, errorMessage) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            input.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #ff4757;
                font-size: 12px;
                margin-top: 4px;
                animation: slideDown 0.3s ease;
            `;
            
            input.parentNode.appendChild(errorElement);
        } else {
            input.classList.remove('error');
        }
    }
    
    setupAutoSave(input) {
        let saveTimeout;
        
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            
            saveTimeout = setTimeout(() => {
                this.autoSaveField(input);
            }, 1000);
        });
    }
    
    autoSaveField(input) {
        const formId = input.closest('form')?.id || 'default';
        const fieldName = input.name || input.id;
        const value = input.value;
        
        // Save to localStorage
        const savedData = JSON.parse(localStorage.getItem(`form_${formId}`) || '{}');
        savedData[fieldName] = value;
        localStorage.setItem(`form_${formId}`, JSON.stringify(savedData));
        
        // Show save indicator
        this.showSaveIndicator(input);
    }
    
    showSaveIndicator(input) {
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.innerHTML = '✓ Salvato';
        indicator.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #00ff88;
            font-size: 12px;
            opacity: 0;
            animation: fadeInOut 2s ease;
        `;
        
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }

    // ===== INTERSECTION OBSERVER =====
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Lazy load images
                    if (entry.target.dataset.src) {
                        this.lazyLoadImage(entry.target);
                    }
                    
                    // Load more content if needed
                    if (entry.target.classList.contains('load-more-trigger')) {
                        this.loadMoreContent();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, [data-src], .load-more-trigger').forEach(el => {
            observer.observe(el);
        });
    }
    
    lazyLoadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
    
    loadMoreContent() {
        if (this.isLoading) return;
        
        console.log('Loading more content...');
        // Implement load more functionality
    }

    // ===== PERFORMANCE MONITORING =====
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 3000) {
                    console.warn('Slow page load detected:', loadTime + 'ms');
                }
            }, 0);
        });
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const usedMB = memInfo.usedJSHeapSize / 1048576;
                
                if (usedMB > 50) {
                    console.warn('High memory usage detected:', usedMB.toFixed(2) + 'MB');
                }
            }, 30000);
        }
    }

    // ===== EVENT LISTENERS =====
    
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input.advanced');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close modals/notifications
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.clearAllNotifications();
            }
        });
        
        // Handle page change events
        document.addEventListener('pageChange', (e) => {
            console.log('Page changed to:', e.detail.page);
        });
        
        // Handle tab change events
        document.addEventListener('tabChange', (e) => {
            console.log('Tab changed to:', e.detail.tabId);
        });
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    clearAllNotifications() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });
    }

    // ===== COMPONENT INITIALIZATION =====
    
    initializeComponents() {
        // Initialize tabs
        document.querySelectorAll('.tabs.advanced').forEach(tabContainer => {
            this.initializeTabs(tabContainer);
        });
        
        // Initialize forms
        document.querySelectorAll('form').forEach(form => {
            if (form.querySelector('.form-input.advanced')) {
                this.enhanceForm(form);
            }
        });
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize progress bars
        this.initializeProgressBars();
    }
    
    initializeTooltips() {
        // Add ARIA labels for accessibility
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.setAttribute('aria-label', element.dataset.tooltip);
        });
    }
    
    initializeProgressBars() {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            const value = bar.dataset.value || 0;
            
            setTimeout(() => {
                fill.style.width = value + '%';
            }, 100);
        });
    }

    // ===== UTILITY METHODS =====
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    formatCurrency(amount, currency = 'EUR') {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('it-IT', { ...defaultOptions, ...options }).format(new Date(date));
    }
}

// Initialize advanced features
let advancedFeatures;

document.addEventListener('DOMContentLoaded', () => {
    advancedFeatures = new AdvancedFeatures();
    
    // Make it globally available
    window.advancedFeatures = advancedFeatures;
    
    console.log('🚀 Advanced Features initialized successfully!');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .form-input.error {
        border-color: #ff4757 !important;
        box-shadow: 0 0 0 4px rgba(255, 71, 87, 0.1) !important;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

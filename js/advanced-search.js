/**
 * Advanced Search and Filter System
 * Provides intelligent search, filtering, sorting and pagination
 */

class AdvancedSearch {
    constructor() {
        this.originalData = [];
        this.filteredData = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            brand: 'all',
            priceRange: { min: 0, max: Infinity },
            yearRange: { min: 1900, max: new Date().getFullYear() + 1 },
            fuel: 'all',
            transmission: 'all',
            status: 'all'
        };
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchHistory = [];
        this.popularSearches = [];
        
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.setupEventListeners();
        this.initializeFilters();
    }

    // ===== DATA MANAGEMENT =====
    
    setData(data) {
        this.originalData = [...data];
        this.filteredData = [...data];
        this.updateResults();
    }
    
    getData() {
        return this.filteredData;
    }
    
    getPaginatedData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex);
    }

    // ===== SEARCH FUNCTIONALITY =====
    
    search(query) {
        if (!query || query.trim() === '') {
            this.currentFilters.search = '';
            this.applyFilters();
            return;
        }
        
        query = query.trim().toLowerCase();
        this.currentFilters.search = query;
        
        // Add to search history
        this.addToSearchHistory(query);
        
        // Apply search with intelligent matching
        this.applyFilters();
        
        // Track popular searches
        this.updatePopularSearches(query);
    }
    
    intelligentSearch(data, query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return data.filter(item => {
            const searchableText = this.getSearchableText(item).toLowerCase();
            
            // Exact match gets highest priority
            if (searchableText.includes(query)) {
                item._searchScore = 100;
                return true;
            }
            
            // Check if all search terms are present
            const matchedTerms = searchTerms.filter(term => searchableText.includes(term));
            const matchRatio = matchedTerms.length / searchTerms.length;
            
            if (matchRatio >= 0.5) { // At least 50% of terms match
                item._searchScore = matchRatio * 80;
                return true;
            }
            
            // Fuzzy matching for typos
            for (const term of searchTerms) {
                if (this.fuzzyMatch(searchableText, term)) {
                    item._searchScore = 30;
                    return true;
                }
            }
            
            return false;
        }).sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
    }
    
    getSearchableText(item) {
        const fields = [
            item.brand || '',
            item.model || '',
            item.nome || '',
            item.titolo || '',
            item.descrizione || '',
            item.description || '',
            item.colore || '',
            item.color || '',
            item.alimentazione || '',
            item.fuel || '',
            item.tipo || '',
            item.type || '',
            item.categoria || '',
            item.cambio || '',
            item.transmission || ''
        ];
        
        return fields.join(' ');
    }
    
    fuzzyMatch(text, pattern) {
        if (pattern.length < 3) return false;
        
        const maxErrors = Math.floor(pattern.length / 4);
        let errors = 0;
        let textIndex = 0;
        
        for (let i = 0; i < pattern.length && textIndex < text.length; i++) {
            if (pattern[i] === text[textIndex]) {
                textIndex++;
            } else {
                errors++;
                if (errors > maxErrors) return false;
                
                // Try to skip character in text
                if (textIndex + 1 < text.length && pattern[i] === text[textIndex + 1]) {
                    textIndex += 2;
                } else {
                    textIndex++;
                }
            }
        }
        
        return errors <= maxErrors;
    }

    // ===== FILTER FUNCTIONALITY =====
    
    applyFilters() {
        let filtered = [...this.originalData];
        
        // Apply search filter
        if (this.currentFilters.search) {
            filtered = this.intelligentSearch(filtered, this.currentFilters.search);
        }
        
        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(item => 
                (item.categoria || item.type) === this.currentFilters.category
            );
        }
        
        // Apply brand filter
        if (this.currentFilters.brand !== 'all') {
            filtered = filtered.filter(item => 
                (item.marca || item.brand) === this.currentFilters.brand
            );
        }
        
        // Apply price range filter
        filtered = filtered.filter(item => {
            const price = item.prezzo || item.price || 0;
            return price >= this.currentFilters.priceRange.min && 
                   price <= this.currentFilters.priceRange.max;
        });
        
        // Apply year range filter
        filtered = filtered.filter(item => {
            const year = item.anno || item.year || 0;
            return year >= this.currentFilters.yearRange.min && 
                   year <= this.currentFilters.yearRange.max;
        });
        
        // Apply fuel filter
        if (this.currentFilters.fuel !== 'all') {
            filtered = filtered.filter(item => 
                (item.alimentazione || item.fuel) === this.currentFilters.fuel
            );
        }
        
        // Apply transmission filter
        if (this.currentFilters.transmission !== 'all') {
            filtered = filtered.filter(item => 
                (item.cambio || item.transmission) === this.currentFilters.transmission
            );
        }
        
        // Apply status filter (for admin)
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(item => 
                (item.status || 'active') === this.currentFilters.status
            );
        }
        
        // Apply sorting
        filtered = this.sortResults(filtered);
        
        this.filteredData = filtered;
        this.currentPage = 1; // Reset to first page
        this.updateResults();
    }
    
    setFilter(filterName, value) {
        if (filterName === 'priceRange' || filterName === 'yearRange') {
            this.currentFilters[filterName] = { ...value };
        } else {
            this.currentFilters[filterName] = value;
        }
        
        this.applyFilters();
    }
    
    clearFilters() {
        this.currentFilters = {
            search: '',
            category: 'all',
            brand: 'all',
            priceRange: { min: 0, max: Infinity },
            yearRange: { min: 1900, max: new Date().getFullYear() + 1 },
            fuel: 'all',
            transmission: 'all',
            status: 'all'
        };
        
        this.applyFilters();
    }

    // ===== SORTING FUNCTIONALITY =====
    
    sortResults(data) {
        return data.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'name':
                    aValue = (a.nome || a.titolo || a.brand + ' ' + a.model || '').toLowerCase();
                    bValue = (b.nome || b.titolo || b.brand + ' ' + b.model || '').toLowerCase();
                    break;
                case 'price':
                    aValue = a.prezzo || a.price || 0;
                    bValue = b.prezzo || b.price || 0;
                    break;
                case 'year':
                    aValue = a.anno || a.year || 0;
                    bValue = b.anno || b.year || 0;
                    break;
                case 'brand':
                    aValue = (a.marca || a.brand || '').toLowerCase();
                    bValue = (b.marca || b.brand || '').toLowerCase();
                    break;
                case 'created':
                    aValue = new Date(a.createdAt || a.created_at || 0);
                    bValue = new Date(b.createdAt || b.created_at || 0);
                    break;
                default:
                    return 0;
            }
            
            if (this.sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });
    }
    
    setSorting(sortBy, sortOrder = null) {
        if (this.sortBy === sortBy && !sortOrder) {
            // Toggle sort order if same field
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = sortBy;
            this.sortOrder = sortOrder || 'asc';
        }
        
        this.applyFilters();
    }

    // ===== PAGINATION =====
    
    setPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateResults();
        }
    }
    
    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.currentPage = 1;
        this.updateResults();
    }
    
    getTotalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }

    // ===== SEARCH HISTORY =====
    
    addToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: query,
            timestamp: new Date().toISOString(),
            results: this.filteredData.length
        });
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        this.saveSearchHistory();
    }
    
    loadSearchHistory() {
        const stored = localStorage.getItem('search_history');
        if (stored) {
            this.searchHistory = JSON.parse(stored);
        }
        
        const popularStored = localStorage.getItem('popular_searches');
        if (popularStored) {
            this.popularSearches = JSON.parse(popularStored);
        }
    }
    
    saveSearchHistory() {
        localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        localStorage.setItem('popular_searches', JSON.stringify(this.popularSearches));
    }
    
    updatePopularSearches(query) {
        const existing = this.popularSearches.find(item => item.query === query);
        if (existing) {
            existing.count++;
        } else {
            this.popularSearches.push({ query: query, count: 1 });
        }
        
        // Sort by count and keep top 10
        this.popularSearches = this.popularSearches
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        this.saveSearchHistory();
    }

    // ===== SUGGESTIONS =====
    
    getSuggestions(query) {
        if (!query || query.length < 2) {
            return this.getPopularSuggestions();
        }
        
        const suggestions = [];
        query = query.toLowerCase();
        
        // Brand suggestions
        const brands = [...new Set(this.originalData.map(item => item.marca || item.brand))];
        brands.forEach(brand => {
            if (brand && brand.toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'brand',
                    value: brand,
                    label: `🏢 ${brand}`,
                    category: 'Marca'
                });
            }
        });
        
        // Model suggestions
        const models = [...new Set(this.originalData.map(item => item.modello || item.model))];
        models.forEach(model => {
            if (model && model.toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'model',
                    value: model,
                    label: `🚗 ${model}`,
                    category: 'Modello'
                });
            }
        });
        
        // Category suggestions
        const categories = [...new Set(this.originalData.map(item => item.categoria || item.type))];
        categories.forEach(category => {
            if (category && category.toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'category',
                    value: category,
                    label: `📂 ${this.getCategoryLabel(category)}`,
                    category: 'Categoria'
                });
            }
        });
        
        // Recent searches
        this.searchHistory.forEach(item => {
            if (item.query.toLowerCase().includes(query)) {
                suggestions.push({
                    type: 'recent',
                    value: item.query,
                    label: `🕒 ${item.query}`,
                    category: 'Ricerche recenti'
                });
            }
        });
        
        return suggestions.slice(0, 8);
    }
    
    getPopularSuggestions() {
        const suggestions = [];
        
        // Popular searches
        this.popularSearches.slice(0, 5).forEach(item => {
            suggestions.push({
                type: 'popular',
                value: item.query,
                label: `🔥 ${item.query}`,
                category: 'Popolari'
            });
        });
        
        // Recent searches
        this.searchHistory.slice(0, 3).forEach(item => {
            suggestions.push({
                type: 'recent',
                value: item.query,
                label: `🕒 ${item.query}`,
                category: 'Recenti'
            });
        });
        
        return suggestions;
    }
    
    getCategoryLabel(category) {
        const labels = {
            'suv': 'SUV',
            'sportiva': 'Sportiva',
            'berlina': 'Berlina',
            'elettrica': 'Elettrica',
            'ibrida': 'Ibrida',
            'cabrio': 'Cabrio',
            'station-wagon': 'Station Wagon'
        };
        return labels[category] || category;
    }

    // ===== EVENT LISTENERS =====
    
    setupEventListeners() {
        // Search input
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('advanced-search-input')) {
                this.handleSearchInput(e);
            }
        });
        
        // Filter changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('advanced-filter')) {
                this.handleFilterChange(e);
            }
        });
        
        // Sort changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sort-btn')) {
                this.handleSortClick(e);
            }
        });
        
        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                this.handlePageClick(e);
            }
        });
    }
    
    handleSearchInput(e) {
        const query = e.target.value;
        clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(() => {
            this.search(query);
        }, 300);
        
        // Show suggestions
        this.showSuggestions(e.target, query);
    }
    
    handleFilterChange(e) {
        const filterName = e.target.dataset.filter;
        const value = e.target.value;
        
        if (filterName === 'priceRange') {
            const [min, max] = value.split('-').map(Number);
            this.setFilter(filterName, { min: min || 0, max: max || Infinity });
        } else if (filterName === 'yearRange') {
            const [min, max] = value.split('-').map(Number);
            this.setFilter(filterName, { min: min || 1900, max: max || new Date().getFullYear() + 1 });
        } else {
            this.setFilter(filterName, value);
        }
    }
    
    handleSortClick(e) {
        const sortBy = e.target.dataset.sort;
        const sortOrder = e.target.dataset.order;
        this.setSorting(sortBy, sortOrder);
    }
    
    handlePageClick(e) {
        const page = parseInt(e.target.dataset.page);
        this.setPage(page);
    }

    // ===== UI UPDATES =====
    
    showSuggestions(inputElement, query) {
        const suggestions = this.getSuggestions(query);
        const container = inputElement.nextElementSibling;
        
        if (!container || !container.classList.contains('suggestions-container')) {
            return;
        }
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            container.classList.remove('show');
            return;
        }
        
        const groupedSuggestions = {};
        suggestions.forEach(suggestion => {
            if (!groupedSuggestions[suggestion.category]) {
                groupedSuggestions[suggestion.category] = [];
            }
            groupedSuggestions[suggestion.category].push(suggestion);
        });
        
        let html = '';
        Object.entries(groupedSuggestions).forEach(([category, items]) => {
            html += `<div class="suggestion-group">`;
            html += `<div class="suggestion-category">${category}</div>`;
            items.forEach(item => {
                html += `
                    <div class="suggestion-item" data-value="${item.value}" data-type="${item.type}">
                        ${item.label}
                    </div>
                `;
            });
            html += `</div>`;
        });
        
        container.innerHTML = html;
        container.classList.add('show');
        
        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const type = item.dataset.type;
                
                if (type === 'brand') {
                    this.setFilter('brand', value);
                } else if (type === 'category') {
                    this.setFilter('category', value);
                } else {
                    inputElement.value = value;
                    this.search(value);
                }
                
                container.classList.remove('show');
            });
        });
    }
    
    updateResults() {
        // Dispatch custom event with results
        document.dispatchEvent(new CustomEvent('searchResults', {
            detail: {
                results: this.getPaginatedData(),
                totalResults: this.filteredData.length,
                currentPage: this.currentPage,
                totalPages: this.getTotalPages(),
                filters: this.currentFilters,
                sortBy: this.sortBy,
                sortOrder: this.sortOrder
            }
        }));
    }

    // ===== FILTER INITIALIZATION =====
    
    initializeFilters() {
        this.createFilterUI();
    }
    
    createFilterUI() {
        // This method can be called to create filter UI dynamically
        // Implementation depends on specific needs
    }
    
    // ===== EXPORT/IMPORT =====
    
    exportResults(format = 'json') {
        const data = {
            results: this.filteredData,
            filters: this.currentFilters,
            sorting: { sortBy: this.sortBy, sortOrder: this.sortOrder },
            totalResults: this.filteredData.length,
            exportDate: new Date().toISOString()
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(this.filteredData);
        }
        
        return data;
    }
    
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => 
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }
    
    // ===== ANALYTICS =====
    
    getSearchAnalytics() {
        return {
            totalSearches: this.searchHistory.length,
            popularSearches: this.popularSearches,
            recentSearches: this.searchHistory.slice(0, 10),
            averageResultsPerSearch: this.searchHistory.reduce((sum, item) => sum + item.results, 0) / this.searchHistory.length || 0
        };
    }
}

// Initialize advanced search
let advancedSearch;

document.addEventListener('DOMContentLoaded', () => {
    advancedSearch = new AdvancedSearch();
    window.advancedSearch = advancedSearch;
    
    console.log('🔍 Advanced Search initialized successfully!');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSearch;
}

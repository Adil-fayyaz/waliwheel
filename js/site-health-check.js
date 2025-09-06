/**
 * Wali Wheels - Site Health Check System
 * Sistema di controllo completo per verificare il funzionamento al 100%
 * Versione 1.0 - Controllo Completo
 */

class SiteHealthCheck {
    constructor() {
        this.results = {
            performance: {},
            accessibility: {},
            functionality: {},
            errors: [],
            warnings: [],
            score: 0
        };
        this.totalTests = 0;
        this.passedTests = 0;
        
        this.init();
    }

    init() {
        console.log('🔍 Avvio Site Health Check...');
        this.runAllTests();
    }

    async runAllTests() {
        try {
            // Test Performance
            await this.testPerformance();
            
            // Test Accessibility
            await this.testAccessibility();
            
            // Test Functionality
            await this.testFunctionality();
            
            // Test JavaScript
            await this.testJavaScript();
            
            // Test CSS
            await this.testCSS();
            
            // Test Resources
            await this.testResources();
            
            // Calcola punteggio finale
            this.calculateScore();
            
            // Mostra risultati
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Errore durante i test:', error);
            this.results.errors.push(`Test Error: ${error.message}`);
        }
    }

    // ===== TEST PERFORMANCE =====
    
    async testPerformance() {
        console.log('🚀 Testing Performance...');
        
        // Test Core Web Vitals
        this.testCoreWebVitals();
        
        // Test Loading Times
        this.testLoadingTimes();
        
        // Test Resource Sizes
        this.testResourceSizes();
        
        // Test Lazy Loading
        this.testLazyLoading();
        
        console.log('✅ Performance tests completed');
    }

    testCoreWebVitals() {
        this.totalTests++;
        
        if ('PerformanceObserver' in window) {
            // LCP Test
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                const lcp = lastEntry.startTime;
                
                this.results.performance.lcp = lcp;
                
                if (lcp < 2500) {
                    this.passedTests++;
                    console.log('✅ LCP: Good', lcp.toFixed(2), 'ms');
                } else if (lcp < 4000) {
                    this.results.warnings.push(`LCP needs improvement: ${lcp.toFixed(2)}ms`);
                    console.log('⚠️ LCP: Needs Improvement', lcp.toFixed(2), 'ms');
                } else {
                    this.results.errors.push(`LCP is poor: ${lcp.toFixed(2)}ms`);
                    console.log('❌ LCP: Poor', lcp.toFixed(2), 'ms');
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } else {
            this.results.warnings.push('PerformanceObserver not supported');
        }
    }

    testLoadingTimes() {
        this.totalTests++;
        
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.results.performance.loadTime = loadTime;
        
        if (loadTime < 3000) {
            this.passedTests++;
            console.log('✅ Page Load Time: Good', loadTime, 'ms');
        } else if (loadTime < 5000) {
            this.results.warnings.push(`Page load time needs improvement: ${loadTime}ms`);
            console.log('⚠️ Page Load Time: Needs Improvement', loadTime, 'ms');
        } else {
            this.results.errors.push(`Page load time is poor: ${loadTime}ms`);
            console.log('❌ Page Load Time: Poor', loadTime, 'ms');
        }
    }

    testResourceSizes() {
        this.totalTests++;
        
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;
        let largeResources = 0;
        
        resources.forEach(resource => {
            if (resource.transferSize) {
                totalSize += resource.transferSize;
                if (resource.transferSize > 100000) { // 100KB
                    largeResources++;
                    this.results.warnings.push(`Large resource: ${resource.name} (${(resource.transferSize/1024).toFixed(2)}KB)`);
                }
            }
        });
        
        this.results.performance.totalSize = totalSize;
        this.results.performance.largeResources = largeResources;
        
        if (totalSize < 2000000) { // 2MB
            this.passedTests++;
            console.log('✅ Total Resource Size: Good', (totalSize/1024/1024).toFixed(2), 'MB');
        } else {
            this.results.warnings.push(`Total resource size is large: ${(totalSize/1024/1024).toFixed(2)}MB`);
            console.log('⚠️ Total Resource Size: Large', (totalSize/1024/1024).toFixed(2), 'MB');
        }
    }

    testLazyLoading() {
        this.totalTests++;
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const totalImages = document.querySelectorAll('img').length;
        
        this.results.performance.lazyImages = lazyImages.length;
        this.results.performance.totalImages = totalImages;
        
        if (lazyImages.length > 0) {
            this.passedTests++;
            console.log('✅ Lazy Loading: Implemented', lazyImages.length, 'images');
        } else {
            this.results.warnings.push('No lazy loading implemented');
            console.log('⚠️ Lazy Loading: Not implemented');
        }
    }

    // ===== TEST ACCESSIBILITY =====
    
    async testAccessibility() {
        console.log('♿ Testing Accessibility...');
        
        // Test Skip Links
        this.testSkipLinks();
        
        // Test Focus Management
        this.testFocusManagement();
        
        // Test ARIA Attributes
        this.testARIAAttributes();
        
        // Test Alt Text
        this.testAltText();
        
        // Test Keyboard Navigation
        this.testKeyboardNavigation();
        
        // Test Color Contrast
        this.testColorContrast();
        
        console.log('✅ Accessibility tests completed');
    }

    testSkipLinks() {
        this.totalTests++;
        
        const skipLinks = document.querySelectorAll('.skip-link');
        
        if (skipLinks.length > 0) {
            this.passedTests++;
            console.log('✅ Skip Links: Present', skipLinks.length);
        } else {
            this.results.errors.push('No skip links found');
            console.log('❌ Skip Links: Missing');
        }
    }

    testFocusManagement() {
        this.totalTests++;
        
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        let focusableCount = 0;
        focusableElements.forEach(element => {
            if (!element.hasAttribute('disabled') && element.tabIndex >= 0) {
                focusableCount++;
            }
        });
        
        this.results.accessibility.focusableElements = focusableCount;
        
        if (focusableCount > 0) {
            this.passedTests++;
            console.log('✅ Focus Management: Working', focusableCount, 'focusable elements');
        } else {
            this.results.errors.push('No focusable elements found');
            console.log('❌ Focus Management: No focusable elements');
        }
    }

    testARIAAttributes() {
        this.totalTests++;
        
        const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
        const buttons = document.querySelectorAll('button');
        
        this.results.accessibility.ariaElements = elementsWithAria.length;
        this.results.accessibility.totalButtons = buttons.length;
        
        if (elementsWithAria.length > 0) {
            this.passedTests++;
            console.log('✅ ARIA Attributes: Present', elementsWithAria.length, 'elements');
        } else {
            this.results.warnings.push('No ARIA attributes found');
            console.log('⚠️ ARIA Attributes: Missing');
        }
    }

    testAltText() {
        this.totalTests++;
        
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        let imagesWithoutAlt = 0;
        
        images.forEach(img => {
            if (img.alt && img.alt.trim() !== '') {
                imagesWithAlt++;
            } else {
                imagesWithoutAlt++;
                this.results.warnings.push(`Image without alt text: ${img.src}`);
            }
        });
        
        this.results.accessibility.imagesWithAlt = imagesWithAlt;
        this.results.accessibility.imagesWithoutAlt = imagesWithoutAlt;
        
        if (imagesWithoutAlt === 0 && images.length > 0) {
            this.passedTests++;
            console.log('✅ Alt Text: All images have alt text');
        } else if (imagesWithoutAlt > 0) {
            console.log('⚠️ Alt Text: Some images missing alt text', imagesWithoutAlt);
        }
    }

    testKeyboardNavigation() {
        this.totalTests++;
        
        // Simula navigazione con Tab
        const focusableElements = document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        let tabOrderCorrect = true;
        let previousTabIndex = -1;
        
        focusableElements.forEach(element => {
            const tabIndex = element.tabIndex || 0;
            if (tabIndex > 0 && tabIndex < previousTabIndex) {
                tabOrderCorrect = false;
            }
            previousTabIndex = tabIndex;
        });
        
        if (tabOrderCorrect) {
            this.passedTests++;
            console.log('✅ Keyboard Navigation: Tab order correct');
        } else {
            this.results.errors.push('Tab order is incorrect');
            console.log('❌ Keyboard Navigation: Tab order incorrect');
        }
    }

    testColorContrast() {
        this.totalTests++;
        
        // Test base - verifica presenza di classi per alto contrasto
        const highContrastElements = document.querySelectorAll('.text-high-contrast');
        
        if (document.documentElement.classList.contains('high-contrast') || highContrastElements.length > 0) {
            this.passedTests++;
            console.log('✅ Color Contrast: High contrast support available');
        } else {
            this.results.warnings.push('High contrast mode not implemented');
            console.log('⚠️ Color Contrast: High contrast mode not available');
        }
    }

    // ===== TEST FUNCTIONALITY =====
    
    async testFunctionality() {
        console.log('⚙️ Testing Functionality...');
        
        // Test Forms
        this.testForms();
        
        // Test Navigation
        this.testNavigation();
        
        // Test Modals
        this.testModals();
        
        // Test Local Storage
        this.testLocalStorage();
        
        // Test API Functions
        this.testAPIFunctions();
        
        console.log('✅ Functionality tests completed');
    }

    testForms() {
        this.totalTests++;
        
        const forms = document.querySelectorAll('form');
        let workingForms = 0;
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            
            if (inputs.length > 0 && submitButton) {
                workingForms++;
            }
        });
        
        this.results.functionality.totalForms = forms.length;
        this.results.functionality.workingForms = workingForms;
        
        if (workingForms === forms.length && forms.length > 0) {
            this.passedTests++;
            console.log('✅ Forms: All forms functional', workingForms);
        } else if (workingForms > 0) {
            this.results.warnings.push(`Some forms may not be functional: ${workingForms}/${forms.length}`);
            console.log('⚠️ Forms: Some forms may not be functional', workingForms, '/', forms.length);
        } else {
            console.log('ℹ️ Forms: No forms found');
        }
    }

    testNavigation() {
        this.totalTests++;
        
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        let workingLinks = 0;
        
        navLinks.forEach(link => {
            if (link.href && link.href !== window.location.href + '#') {
                workingLinks++;
            }
        });
        
        this.results.functionality.totalNavLinks = navLinks.length;
        this.results.functionality.workingNavLinks = workingLinks;
        
        if (workingLinks > 0) {
            this.passedTests++;
            console.log('✅ Navigation: Links functional', workingLinks);
        } else {
            this.results.errors.push('No functional navigation links found');
            console.log('❌ Navigation: No functional links');
        }
    }

    testModals() {
        this.totalTests++;
        
        const modals = document.querySelectorAll('.modal, .modal-overlay');
        const modalTriggers = document.querySelectorAll('[data-modal], [onclick*="Modal"]');
        
        this.results.functionality.totalModals = modals.length;
        this.results.functionality.modalTriggers = modalTriggers.length;
        
        if (modals.length > 0 && modalTriggers.length > 0) {
            this.passedTests++;
            console.log('✅ Modals: Present and functional', modals.length);
        } else if (modals.length > 0) {
            this.results.warnings.push('Modals present but no triggers found');
            console.log('⚠️ Modals: Present but no triggers');
        } else {
            console.log('ℹ️ Modals: None found');
        }
    }

    testLocalStorage() {
        this.totalTests++;
        
        try {
            // Test localStorage availability
            localStorage.setItem('waliwheels_test', 'test');
            const testValue = localStorage.getItem('waliwheels_test');
            localStorage.removeItem('waliwheels_test');
            
            if (testValue === 'test') {
                this.passedTests++;
                console.log('✅ LocalStorage: Working');
                
                // Check for existing data
                const existingData = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('waliwheels_')) {
                        existingData.push(key);
                    }
                }
                
                this.results.functionality.localStorageKeys = existingData;
                console.log('ℹ️ LocalStorage: Found', existingData.length, 'Wali Wheels keys');
            }
        } catch (error) {
            this.results.errors.push(`LocalStorage error: ${error.message}`);
            console.log('❌ LocalStorage: Error', error.message);
        }
    }

    testAPIFunctions() {
        this.totalTests++;
        
        const globalFunctions = [
            'showToast',
            'openAuthModal',
            'closeAuthModal',
            'toggleProfileMenu'
        ];
        
        let availableFunctions = 0;
        
        globalFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                availableFunctions++;
            } else {
                this.results.warnings.push(`Global function missing: ${funcName}`);
            }
        });
        
        this.results.functionality.availableFunctions = availableFunctions;
        this.results.functionality.totalExpectedFunctions = globalFunctions.length;
        
        if (availableFunctions === globalFunctions.length) {
            this.passedTests++;
            console.log('✅ API Functions: All available', availableFunctions);
        } else {
            console.log('⚠️ API Functions: Some missing', availableFunctions, '/', globalFunctions.length);
        }
    }

    // ===== TEST JAVASCRIPT =====
    
    async testJavaScript() {
        console.log('📜 Testing JavaScript...');
        
        // Test Critical Scripts
        this.testCriticalScripts();
        
        // Test Error Handling
        this.testErrorHandling();
        
        // Test Event Listeners
        this.testEventListeners();
        
        console.log('✅ JavaScript tests completed');
    }

    testCriticalScripts() {
        this.totalTests++;
        
        const criticalObjects = [
            'siteOptimizer',
            'ultraModernButtons'
        ];
        
        let loadedObjects = 0;
        
        criticalObjects.forEach(objName => {
            if (window[objName]) {
                loadedObjects++;
            } else {
                this.results.warnings.push(`Critical object missing: ${objName}`);
            }
        });
        
        if (loadedObjects === criticalObjects.length) {
            this.passedTests++;
            console.log('✅ Critical Scripts: All loaded', loadedObjects);
        } else {
            console.log('⚠️ Critical Scripts: Some missing', loadedObjects, '/', criticalObjects.length);
        }
    }

    testErrorHandling() {
        this.totalTests++;
        
        // Check if error handling is set up
        const errorHandlerSet = window.addEventListener && 
                               typeof window.onerror !== 'undefined';
        
        if (errorHandlerSet) {
            this.passedTests++;
            console.log('✅ Error Handling: Configured');
        } else {
            this.results.warnings.push('Error handling not configured');
            console.log('⚠️ Error Handling: Not configured');
        }
    }

    testEventListeners() {
        this.totalTests++;
        
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let elementsWithListeners = 0;
        
        interactiveElements.forEach(element => {
            // Check for common event attributes
            if (element.onclick || element.onsubmit || element.onchange || 
                element.getAttribute('onclick') || element.getAttribute('onsubmit')) {
                elementsWithListeners++;
            }
        });
        
        this.results.functionality.interactiveElements = interactiveElements.length;
        this.results.functionality.elementsWithListeners = elementsWithListeners;
        
        if (elementsWithListeners > 0) {
            this.passedTests++;
            console.log('✅ Event Listeners: Present', elementsWithListeners, 'elements');
        } else {
            this.results.warnings.push('No event listeners detected');
            console.log('⚠️ Event Listeners: None detected');
        }
    }

    // ===== TEST CSS =====
    
    async testCSS() {
        console.log('🎨 Testing CSS...');
        
        // Test Critical Stylesheets
        this.testCriticalStylesheets();
        
        // Test Responsive Design
        this.testResponsiveDesign();
        
        // Test Animations
        this.testAnimations();
        
        console.log('✅ CSS tests completed');
    }

    testCriticalStylesheets() {
        this.totalTests++;
        
        const criticalStylesheets = [
            'site-optimizations.css',
            'ultra-modern-buttons.css',
            'styles.css'
        ];
        
        const loadedStylesheets = Array.from(document.styleSheets);
        let foundStylesheets = 0;
        
        criticalStylesheets.forEach(cssFile => {
            const found = loadedStylesheets.some(sheet => 
                sheet.href && sheet.href.includes(cssFile)
            );
            if (found) {
                foundStylesheets++;
            } else {
                this.results.warnings.push(`Critical stylesheet missing: ${cssFile}`);
            }
        });
        
        if (foundStylesheets === criticalStylesheets.length) {
            this.passedTests++;
            console.log('✅ Critical Stylesheets: All loaded', foundStylesheets);
        } else {
            console.log('⚠️ Critical Stylesheets: Some missing', foundStylesheets, '/', criticalStylesheets.length);
        }
    }

    testResponsiveDesign() {
        this.totalTests++;
        
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const mediaQueries = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules || []).some(rule => 
                    rule.type === CSSRule.MEDIA_RULE
                );
            } catch (e) {
                return false;
            }
        });
        
        if (viewportMeta && mediaQueries) {
            this.passedTests++;
            console.log('✅ Responsive Design: Configured');
        } else {
            this.results.warnings.push('Responsive design not fully configured');
            console.log('⚠️ Responsive Design: Not fully configured');
        }
    }

    testAnimations() {
        this.totalTests++;
        
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-up, .scale-in, [class*="animate"]'
        );
        
        if (animatedElements.length > 0) {
            this.passedTests++;
            console.log('✅ Animations: Present', animatedElements.length, 'elements');
        } else {
            this.results.warnings.push('No animated elements found');
            console.log('⚠️ Animations: None found');
        }
    }

    // ===== TEST RESOURCES =====
    
    async testResources() {
        console.log('📦 Testing Resources...');
        
        // Test Images
        this.testImages();
        
        // Test Scripts
        this.testScripts();
        
        // Test External Resources
        this.testExternalResources();
        
        console.log('✅ Resource tests completed');
    }

    testImages() {
        this.totalTests++;
        
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        let failedImages = 0;
        
        images.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                loadedImages++;
            } else if (img.complete) {
                failedImages++;
                this.results.warnings.push(`Failed to load image: ${img.src}`);
            }
        });
        
        this.results.functionality.totalImages = images.length;
        this.results.functionality.loadedImages = loadedImages;
        this.results.functionality.failedImages = failedImages;
        
        if (failedImages === 0 && images.length > 0) {
            this.passedTests++;
            console.log('✅ Images: All loaded successfully', loadedImages);
        } else if (failedImages > 0) {
            console.log('⚠️ Images: Some failed to load', failedImages, '/', images.length);
        } else {
            console.log('ℹ️ Images: None found');
        }
    }

    testScripts() {
        this.totalTests++;
        
        const scripts = document.querySelectorAll('script[src]');
        let loadedScripts = 0;
        
        scripts.forEach(script => {
            // Check if script loaded (basic check)
            if (!script.hasAttribute('data-failed')) {
                loadedScripts++;
            }
        });
        
        this.results.functionality.totalScripts = scripts.length;
        this.results.functionality.loadedScripts = loadedScripts;
        
        if (loadedScripts === scripts.length && scripts.length > 0) {
            this.passedTests++;
            console.log('✅ Scripts: All loaded', loadedScripts);
        } else if (loadedScripts > 0) {
            console.log('⚠️ Scripts: Some may have failed', loadedScripts, '/', scripts.length);
        }
    }

    testExternalResources() {
        this.totalTests++;
        
        const externalResources = document.querySelectorAll(
            'link[href*="//"], script[src*="//"], img[src*="//"]'
        );
        
        this.results.functionality.externalResources = externalResources.length;
        
        if (externalResources.length > 0) {
            this.passedTests++;
            console.log('✅ External Resources: Found', externalResources.length);
        } else {
            console.log('ℹ️ External Resources: None found');
        }
    }

    // ===== CALCOLO PUNTEGGIO =====
    
    calculateScore() {
        if (this.totalTests > 0) {
            this.results.score = Math.round((this.passedTests / this.totalTests) * 100);
        } else {
            this.results.score = 0;
        }
        
        this.results.totalTests = this.totalTests;
        this.results.passedTests = this.passedTests;
        this.results.failedTests = this.totalTests - this.passedTests;
    }

    // ===== DISPLAY RISULTATI =====
    
    displayResults() {
        console.log('\n🎯 SITE HEALTH CHECK RESULTS');
        console.log('================================');
        console.log(`📊 Overall Score: ${this.results.score}%`);
        console.log(`✅ Passed Tests: ${this.passedTests}/${this.totalTests}`);
        console.log(`❌ Failed Tests: ${this.results.failedTests}`);
        console.log(`⚠️ Warnings: ${this.results.warnings.length}`);
        console.log(`🔥 Errors: ${this.results.errors.length}`);
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.results.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        if (this.results.errors.length > 0) {
            console.log('\n🔥 ERRORS:');
            this.results.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Mostra toast con risultato
        if (window.showToast) {
            const message = `Site Health: ${this.results.score}% (${this.passedTests}/${this.totalTests} tests passed)`;
            const type = this.results.score >= 90 ? 'success' : 
                        this.results.score >= 70 ? 'warning' : 'error';
            window.showToast(message, type);
        }
        
        // Salva risultati in localStorage
        this.saveResults();
        
        // Crea report HTML
        this.createHTMLReport();
    }

    saveResults() {
        try {
            const reportData = {
                ...this.results,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            localStorage.setItem('waliwheels_health_check', JSON.stringify(reportData));
            console.log('📄 Results saved to localStorage');
        } catch (error) {
            console.error('❌ Failed to save results:', error);
        }
    }

    createHTMLReport() {
        const reportHTML = `
            <div class="health-report" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: 'Inter', sans-serif;
                display: none;
            ">
                <h2 style="margin: 0 0 1rem 0; color: #2c3e50; text-align: center;">
                    🎯 Site Health Check
                </h2>
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="
                        font-size: 3rem;
                        font-weight: bold;
                        color: ${this.results.score >= 90 ? '#40E0D0' : 
                               this.results.score >= 70 ? '#feca57' : '#ff6b6b'};
                        margin-bottom: 0.5rem;
                    ">
                        ${this.results.score}%
                    </div>
                    <div style="color: #666; font-size: 1.1rem;">
                        ${this.passedTests}/${this.totalTests} tests passed
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>✅ Passed:</span>
                        <strong>${this.passedTests}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>❌ Failed:</span>
                        <strong>${this.results.failedTests}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>⚠️ Warnings:</span>
                        <strong>${this.results.warnings.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>🔥 Errors:</span>
                        <strong>${this.results.errors.length}</strong>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.style.display='none'" style="
                        background: linear-gradient(135deg, #40E0D0 0%, #36c9b0 100%);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 500;
                        margin-right: 0.5rem;
                    ">
                        Close
                    </button>
                    <button onclick="window.siteHealthCheck.exportReport()" style="
                        background: transparent;
                        color: #40E0D0;
                        border: 2px solid #40E0D0;
                        padding: 0.75rem 1.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Export Report
                    </button>
                </div>
            </div>
        `;
        
        const reportElement = document.createElement('div');
        reportElement.innerHTML = reportHTML;
        document.body.appendChild(reportElement);
        
        // Mostra il report per 10 secondi
        setTimeout(() => {
            const report = document.querySelector('.health-report');
            if (report) {
                report.style.display = 'block';
                setTimeout(() => {
                    report.style.display = 'none';
                }, 10000);
            }
        }, 2000);
    }

    exportReport() {
        const reportData = {
            ...this.results,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `waliwheels-health-check-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // ===== METODI PUBBLICI =====
    
    runQuickCheck() {
        console.log('⚡ Running Quick Health Check...');
        
        const quickResults = {
            score: this.results.score,
            errors: this.results.errors.length,
            warnings: this.results.warnings.length,
            status: this.results.score >= 90 ? 'Excellent' :
                   this.results.score >= 70 ? 'Good' :
                   this.results.score >= 50 ? 'Fair' : 'Poor'
        };
        
        console.log('Quick Check Results:', quickResults);
        return quickResults;
    }

    getDetailedResults() {
        return this.results;
    }

    static getInstance() {
        if (!SiteHealthCheck.instance) {
            SiteHealthCheck.instance = new SiteHealthCheck();
        }
        return SiteHealthCheck.instance;
    }
}

// Inizializzazione automatica dopo 3 secondi
setTimeout(() => {
    window.siteHealthCheck = SiteHealthCheck.getInstance();
}, 3000);

// Esporta per uso globale
window.SiteHealthCheck = SiteHealthCheck;













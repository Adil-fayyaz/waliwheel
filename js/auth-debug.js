/**
 * Authentication Debug System
 * Sistema di debug per identificare e risolvere problemi di autenticazione
 */

class AuthDebug {
    constructor() {
        this.debugMode = true;
        this.init();
    }

    init() {
        if (this.debugMode) {
            this.setupDebugUI();
            this.checkFirebaseConfig();
            this.checkDomainAuthorization();
            this.monitorAuthEvents();
        }
    }

    setupDebugUI() {
        // Create debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'auth-debug-panel';
        debugPanel.innerHTML = `
            <div class="debug-panel">
                <h3>🔧 Auth Debug Panel</h3>
                <div class="debug-section">
                    <h4>Firebase Config</h4>
                    <div id="firebase-config-status">Checking...</div>
                </div>
                <div class="debug-section">
                    <h4>Domain Authorization</h4>
                    <div id="domain-status">Checking...</div>
                </div>
                <div class="debug-section">
                    <h4>Auth Events</h4>
                    <div id="auth-events">No events yet</div>
                </div>
                <div class="debug-section">
                    <h4>Quick Actions</h4>
                    <button onclick="authDebug.testGoogleAuth()">Test Google Auth</button>
                    <button onclick="authDebug.clearStorage()">Clear Storage</button>
                    <button onclick="authDebug.showUserInfo()">Show User Info</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .debug-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid #333;
            }
            
            .debug-panel h3 {
                margin: 0 0 15px 0;
                color: #00ff88;
            }
            
            .debug-section {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #333;
            }
            
            .debug-section h4 {
                margin: 0 0 8px 0;
                color: #22d3ee;
                font-size: 14px;
            }
            
            .debug-panel button {
                background: #00ff88;
                color: #000;
                border: none;
                padding: 5px 10px;
                margin: 2px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            }
            
            .debug-panel button:hover {
                background: #22d3ee;
            }
            
            .status-ok { color: #00ff88; }
            .status-error { color: #ff4757; }
            .status-warning { color: #ffa502; }
        `;
        document.head.appendChild(style);

        // Only show in development
        if (location.hostname === 'localhost' || location.hostname.includes('vercel.app')) {
            document.body.appendChild(debugPanel);
        }
    }

    checkFirebaseConfig() {
        const statusDiv = document.getElementById('firebase-config-status');
        if (!statusDiv) return;

        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined' && !window.auth) {
                statusDiv.innerHTML = '<span class="status-error">❌ Firebase not loaded</span>';
                return;
            }

            // Check config
            const config = {
                apiKey: "AIzaSyBj5nRA_1R3RLL91PyZM11rNYDR2PTgqkc",
                authDomain: "log-in-33798.firebaseapp.com",
                projectId: "log-in-33798"
            };

            let status = '<span class="status-ok">✅ Firebase Config OK</span><br>';
            status += `Project ID: ${config.projectId}<br>`;
            status += `Auth Domain: ${config.authDomain}<br>`;
            status += `Current Domain: ${location.hostname}`;

            statusDiv.innerHTML = status;
        } catch (error) {
            statusDiv.innerHTML = `<span class="status-error">❌ Config Error: ${error.message}</span>`;
        }
    }

    checkDomainAuthorization() {
        const statusDiv = document.getElementById('domain-status');
        if (!statusDiv) return;

        const currentDomain = location.hostname;
        const authorizedDomains = [
            'localhost',
            '127.0.0.1',
            'log-in-33798.firebaseapp.com',
            'sito-di-vendita-auto.vercel.app',
            'sito-di-vendita-auto-10fwlyrur-adil-fayyazs-projects.vercel.app'
        ];

        const isAuthorized = authorizedDomains.some(domain => 
            currentDomain === domain || currentDomain.includes(domain)
        );

        if (isAuthorized) {
            statusDiv.innerHTML = `<span class="status-ok">✅ Domain authorized</span><br>${currentDomain}`;
        } else {
            statusDiv.innerHTML = `
                <span class="status-error">❌ Domain not authorized</span><br>
                Current: ${currentDomain}<br>
                <span class="status-warning">Add this domain to Firebase Auth → Authorized domains</span>
            `;
        }
    }

    monitorAuthEvents() {
        const eventsDiv = document.getElementById('auth-events');
        if (!eventsDiv) return;

        let eventCount = 0;
        const maxEvents = 10;

        // Monitor auth state changes
        if (window.authSystem) {
            const originalUpdateUI = window.authSystem.updateUI.bind(window.authSystem);
            window.authSystem.updateUI = function() {
                originalUpdateUI();
                authDebug.logEvent('Auth UI Updated', { 
                    isAuthenticated: this.isAuthenticated,
                    user: this.currentUser ? 'Logged in' : 'Not logged in'
                });
            };
        }

        // Monitor custom events
        window.addEventListener('userLoggedIn', (e) => {
            this.logEvent('User Logged In', e.detail);
        });

        window.addEventListener('userLoggedOut', () => {
            this.logEvent('User Logged Out');
        });

        this.logEvent = (event, data = {}) => {
            eventCount++;
            const timestamp = new Date().toLocaleTimeString();
            const eventHtml = `
                <div style="margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    <strong>${timestamp}</strong> - ${event}<br>
                    ${data ? JSON.stringify(data, null, 2) : ''}
                </div>
            `;
            
            eventsDiv.innerHTML = eventHtml + eventsDiv.innerHTML;
            
            // Keep only last 10 events
            const events = eventsDiv.children;
            if (events.length > maxEvents) {
                events[maxEvents].remove();
            }
        };
    }

    async testGoogleAuth() {
        console.log('🧪 Testing Google Auth...');
        
        try {
            if (!window.authSystem) {
                throw new Error('Auth system not initialized');
            }

            // Test popup
            console.log('Testing popup method...');
            await window.authSystem.signInWithGoogle();
        } catch (error) {
            console.error('Test failed:', error);
            this.logEvent('Test Failed', { error: error.message, code: error.code });
        }
    }

    clearStorage() {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🗑️ Storage cleared');
        this.logEvent('Storage Cleared');
        
        // Reload page
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    showUserInfo() {
        const user = localStorage.getItem('waliwheels_user');
        if (user) {
            console.log('👤 User Info:', JSON.parse(user));
            this.logEvent('User Info', JSON.parse(user));
        } else {
            console.log('👤 No user in storage');
            this.logEvent('No User in Storage');
        }
    }

    // Public method to log events
    logEvent(event, data = {}) {
        const eventsDiv = document.getElementById('auth-events');
        if (!eventsDiv) return;

        const timestamp = new Date().toLocaleTimeString();
        const eventHtml = `
            <div style="margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                <strong>${timestamp}</strong> - ${event}<br>
                ${data ? JSON.stringify(data, null, 2) : ''}
            </div>
        `;
        
        eventsDiv.innerHTML = eventHtml + eventsDiv.innerHTML;
    }
}

// Initialize debug system
let authDebug;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize in development
    if (location.hostname === 'localhost' || location.hostname.includes('vercel.app')) {
        authDebug = new AuthDebug();
        window.authDebug = authDebug;
        console.log('🔧 Auth Debug System initialized');
    }
});

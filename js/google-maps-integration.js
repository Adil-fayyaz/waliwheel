// Integrazione Google Maps per Wali Wheelse
class GoogleMapsIntegration {
    constructor() {
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
        this.dealerLocation = {
            lat: 45.4642, // Milano centro
            lng: 9.1900,
            address: 'Via Roma 123, 20100 Milano, Italia'
        };
        this.init();
    }

    init() {
        this.loadGoogleMapsAPI();
    }

    loadGoogleMapsAPI() {
        // Controlla se l'API è già caricata
        if (window.google && window.google.maps) {
            this.initializeMap();
            return;
        }

        // Carica l'API di Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            this.initializeMap();
        };
        script.onerror = () => {
            this.showFallbackMap();
        };
        
        document.head.appendChild(script);
    }

    initializeMap() {
        try {
            // Crea la mappa
            this.map = new google.maps.Map(document.getElementById('googleMap'), {
                center: this.dealerLocation,
                zoom: 15,
                styles: this.getMapStyles(),
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                }
            });

            // Aggiungi marker per la concessionaria
            this.addDealerMarker();

            // Aggiungi controlli personalizzati
            this.addCustomControls();

            // Aggiungi funzionalità di ricerca
            this.addSearchFunctionality();

            // Aggiungi funzionalità di routing
            this.addRoutingFunctionality();

        } catch (error) {
            console.error('Errore nell\'inizializzazione della mappa:', error);
            this.showFallbackMap();
        }
    }

    addDealerMarker() {
        // Crea marker personalizzato
        this.marker = new google.maps.Marker({
            position: this.dealerLocation,
            map: this.map,
            title: 'Wali Wheelse - Concessionaria Auto di Lusso',
            icon: this.createCustomMarker(),
            animation: google.maps.Animation.DROP
        });

        // Crea info window
        this.infoWindow = new google.maps.InfoWindow({
            content: this.createInfoWindowContent()
        });

        // Mostra info window al click
        this.marker.addListener('click', () => {
            this.infoWindow.open(this.map, this.marker);
        });

        // Mostra info window automaticamente dopo 2 secondi
        setTimeout(() => {
            this.infoWindow.open(this.map, this.marker);
        }, 2000);
    }

    createCustomMarker() {
        // Crea un marker SVG personalizzato
        const svgMarker = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <circle cx="20" cy="20" r="18" fill="url(#grad1)" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="20" cy="20" r="8" fill="#ffffff"/>
                    <path d="M20 8 L20 32 M8 20 L32 20" stroke="#667eea" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        };

        return svgMarker;
    }

    createInfoWindowContent() {
        return `
            <div class="map-info-window">
                <div class="info-window-header">
                    <h3>🚗 Wali Wheelse</h3>
                    <p class="info-window-subtitle">Concessionaria Auto di Lusso</p>
                </div>
                <div class="info-window-content">
                    <p><strong>📍 Indirizzo:</strong><br>${this.dealerLocation.address}</p>
                    <p><strong>📞 Telefono:</strong><br>+39 123 456 789</p>
                    <p><strong>📧 Email:</strong><br>info@waliwheelse.it</p>
                    <p><strong>🕒 Orari:</strong><br>Lun-Ven: 9:00-18:00<br>Sab: 9:00-12:00</p>
                </div>
                <div class="info-window-actions">
                    <button class="btn-directions" onclick="window.googleMapsIntegration.getDirections()">
                        🗺️ Indicazioni
                    </button>
                    <button class="btn-call" onclick="window.googleMapsIntegration.callDealer()">
                        📞 Chiama
                    </button>
                </div>
            </div>
        `;
    }

    addCustomControls() {
        // Pulsante per centrare la mappa sulla concessionaria
        const centerControl = document.createElement('div');
        centerControl.className = 'map-control center-control';
        centerControl.innerHTML = `
            <button class="control-btn" title="Centra sulla concessionaria">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </button>
        `;

        centerControl.addEventListener('click', () => {
            this.map.panTo(this.dealerLocation);
            this.map.setZoom(15);
        });

        // Pulsante per cambiare stile mappa
        const styleControl = document.createElement('div');
        styleControl.className = 'map-control style-control';
        styleControl.innerHTML = `
            <button class="control-btn" title="Cambia stile mappa">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </button>
        `);

        let currentStyle = 0;
        const styles = [
            this.getMapStyles(),
            this.getSatelliteStyle(),
            this.getMinimalStyle()
        ];

        styleControl.addEventListener('click', () => {
            currentStyle = (currentStyle + 1) % styles.length;
            this.map.setOptions({ styles: styles[currentStyle] });
        });

        // Aggiungi controlli alla mappa
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControl);
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(styleControl);
    }

    addSearchFunctionality() {
        // Crea input di ricerca
        const searchBox = document.createElement('div');
        searchBox.className = 'map-search-box';
        searchBox.innerHTML = `
            <input type="text" placeholder="Cerca indirizzo..." id="mapSearchInput">
            <button class="search-btn" id="mapSearchBtn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </button>
        `;

        // Aggiungi alla mappa
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);

        // Funzionalità di ricerca
        const searchInput = document.getElementById('mapSearchInput');
        const searchBtn = document.getElementById('mapSearchBtn');

        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                
                // Aggiungi marker temporaneo per la ricerca
                const searchMarker = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    title: query,
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
                                <path d="M15 8 L15 22 M8 15 L22 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(30, 30)
                    }
                });

                // Centra mappa sulla posizione trovata
                this.map.panTo(location);
                this.map.setZoom(16);

                // Rimuovi marker dopo 5 secondi
                setTimeout(() => {
                    searchMarker.setMap(null);
                }, 5000);

                // Mostra info window
                const searchInfoWindow = new google.maps.InfoWindow({
                    content: `<div class="search-result-info"><strong>Risultato ricerca:</strong><br>${query}</div>`
                });
                searchInfoWindow.open(this.map, searchMarker);

            } else {
                this.showNotification('Indirizzo non trovato. Riprova con un termine diverso.', 'error');
            }
        });
    }

    addRoutingFunctionality() {
        // Pulsante per indicazioni
        const directionsControl = document.createElement('div');
        directionsControl.className = 'map-control directions-control';
        directionsControl.innerHTML = `
            <button class="control-btn" title="Ottieni indicazioni">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                </svg>
            </button>
        `;

        directionsControl.addEventListener('click', () => {
            this.getDirections();
        });

        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(directionsControl);
    }

    getDirections() {
        // Apri Google Maps con indicazioni
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.dealerLocation.address)}`;
        window.open(directionsUrl, '_blank');
    }

    callDealer() {
        // Apri app telefono
        window.open('tel:+39123456789', '_self');
    }

    getMapStyles() {
        return [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c9c9c9' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
            }
        ];
    }

    getSatelliteStyle() {
        return [];
    }

    getMinimalStyle() {
        return [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#7c93a3' }]
            },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{ color: '#fefefe' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#87ceeb' }]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#a2daf2' }]
            }
        ];
    }

    showFallbackMap() {
        // Mostra mappa di fallback se Google Maps non è disponibile
        const mapContainer = document.getElementById('googleMap');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="fallback-map">
                    <div class="fallback-content">
                        <div class="fallback-icon">🗺️</div>
                        <h3>Mappa non disponibile</h3>
                        <p>Google Maps non è disponibile al momento.</p>
                        <div class="fallback-info">
                            <p><strong>📍 Indirizzo:</strong><br>${this.dealerLocation.address}</p>
                            <p><strong>📞 Telefono:</strong><br>+39 123 456 789</p>
                            <p><strong>📧 Email:</strong><br>info@waliwheelse.it</p>
                        </div>
                        <a href="https://maps.google.com/?q=${encodeURIComponent(this.dealerLocation.address)}" 
                           target="_blank" class="btn-external-map">
                            🗺️ Apri in Google Maps
                        </a>
                    </div>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `map-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        // Stili inline per la notifica
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10002;
            transform: translateX(-400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Anima entrata
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Rimuovi dopo 4 secondi
        setTimeout(() => {
            notification.style.transform = 'translateX(-400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Metodo pubblico per ottenere indicazioni
    getDirections() {
        if (this.map) {
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.dealerLocation.address)}`;
            window.open(directionsUrl, '_blank');
        }
    }

    // Metodo pubblico per chiamare
    callDealer() {
        window.open('tel:+39123456789', '_self');
    }
}

// Inizializza l'integrazione Google Maps
document.addEventListener('DOMContentLoaded', () => {
    // Cerca container mappa
    const mapContainer = document.getElementById('googleMap');
    if (mapContainer) {
        window.googleMapsIntegration = new GoogleMapsIntegration();
    }
});

// Esporta per uso esterno
window.GoogleMapsIntegration = GoogleMapsIntegration;

/**
 * Service Worker NUCLEARE - Wali Wheelse
 * Cache intelligente e funzionalità offline
 */

const CACHE_NAME = 'wali-wheelse-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';
const API_CACHE = 'api-v2.0.0';

// Risorse critiche per cache immediata
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/macchine.html',
    '/catalogo.html',
    '/chi-siamo.html',
    '/finanziamento.html',
    '/contatti.html',
    '/admin.html',
    '/css/styles.css',
    '/css/reset.css',
    '/css/utilities.css',
    '/css/button-effects.css',
    '/css/glassmorphism-buttons.css',
    '/css/advanced-effects.css',
    '/js/main.js',
    '/js/utils.js',
    '/js/navigation.js',
    '/js/macchine.js',
    '/js/admin.js',
    '/js/analytics.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap'
];

// Strategie di cache
const CACHE_STRATEGIES = {
    STATIC: 'cache-first',
    DYNAMIC: 'stale-while-revalidate',
    API: 'network-first',
    IMAGES: 'cache-first'
};

// Installazione Service Worker
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker NUCLEARE installato');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Cache statica creata');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Risorse critiche cacheate');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Errore installazione cache:', error);
            })
    );
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔥 Service Worker NUCLEARE attivato');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE) {
                            console.log('🗑️ Cache obsoleta rimossa:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Cache pulite');
                return self.clients.claim();
            })
    );
});

// Intercettazione richieste
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Strategia per risorse statiche
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }
    
    // Strategia per immagini
    if (isImage(request)) {
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
        return;
    }
    
    // Strategia per API
    if (isAPI(request)) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }
    
    // Strategia per HTML
    if (isHTML(request)) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        return;
    }
    
    // Strategia per CSS/JS
    if (isCSSorJS(request)) {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
        return;
    }
    
    // Fallback per altre richieste
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Strategia Cache First
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Errore cache first:', error);
        return new Response('Offline - Contenuto non disponibile', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Strategia Network First
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('🔄 Fallback alla cache per:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Offline fallback
        if (isHTML(request)) {
            return caches.match('/offline.html');
        }
        
        return new Response('Offline - Contenuto non disponibile', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Strategia Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        console.log('🔄 Errore aggiornamento cache per:', request.url);
    });
    
    return cachedResponse || fetchPromise;
}

// Funzioni di utilità
function isStaticAsset(request) {
    return STATIC_ASSETS.includes(request.url) || 
           request.url.includes('/css/') || 
           request.url.includes('/js/') ||
           request.url.includes('fonts.googleapis.com');
}

function isImage(request) {
    return request.destination === 'image' || 
           /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

function isAPI(request) {
    return request.url.includes('/api/') || 
           request.url.includes('jsonplaceholder') ||
           request.url.includes('analytics');
}

function isHTML(request) {
    return request.destination === 'document' || 
           request.url.endsWith('.html') ||
           request.url.endsWith('/');
}

function isCSSorJS(request) {
    return request.destination === 'script' || 
           request.destination === 'style' ||
           /\.(css|js)$/i.test(request.url);
}

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        event.ports[0].postMessage({
            type: 'CACHE_STATUS',
            staticCache: STATIC_CACHE,
            dynamicCache: DYNAMIC_CACHE,
            apiCache: API_CACHE
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({
                    type: 'CACHE_CLEARED',
                    success: true
                });
            })
        );
    }
});

// Gestione push notifications
self.addEventListener('push', (event) => {
    console.log('📱 Push notification ricevuta');
    
    const options = {
        body: event.data ? event.data.text() : 'Nuova notifica da Wali Wheelse',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Esplora',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Chiudi',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Wali Wheelse', options)
    );
});

// Gestione click su notifiche
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Notifica cliccata:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/macchine.html')
        );
    }
});

// Background sync per operazioni offline
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sincronizza dati offline
        const offlineData = await getOfflineData();
        if (offlineData.length > 0) {
            console.log('📡 Sincronizzazione dati offline:', offlineData.length);
            // Invia dati al server
            await syncOfflineData(offlineData);
        }
    } catch (error) {
        console.error('❌ Errore background sync:', error);
    }
}

async function getOfflineData() {
    // Recupera dati salvati offline
    return [];
}

async function syncOfflineData(data) {
    // Sincronizza con il server
    console.log('✅ Dati sincronizzati:', data.length);
}

console.log('🚀 Service Worker NUCLEARE caricato - Wali Wheelse');


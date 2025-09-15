// Service Worker for Advanced Caching and Performance
const CACHE_NAME = 'wali-wheels-v1.0.0';
const STATIC_CACHE = 'wali-wheels-static-v1.0.0';
const DYNAMIC_CACHE = 'wali-wheels-dynamic-v1.0.0';
const IMAGE_CACHE = 'wali-wheels-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/esplora-macchine.html',
    '/admin.html',
    '/chi-siamo.html',
    '/contatti.html',
    '/finanziamento.html',
    '/profilo.html',
    '/css/styles.css',
    '/css/advanced-ui.css',
    '/css/admin.css',
    '/css/reset.css',
    '/css/utilities.css',
    '/js/main.js',
    '/js/advanced-features.js',
    '/js/performance-optimizer.js',
    '/js/image-gallery.js',
    '/js/advanced-search.js'
];

// Assets to cache on first use
const DYNAMIC_ASSETS = [
    '/dettagli-macchina.html',
    '/catalogo.html'
];

// Image extensions to cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE),
            caches.open(IMAGE_CACHE)
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== IMAGE_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handlePageRequest(request));
    }
});

// Check if request is for an image
function isImageRequest(request) {
    const url = new URL(request.url);
    return IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
           request.destination === 'image';
}

// Check if request is for a static asset
function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.toLowerCase();
    
    return pathname.includes('/css/') ||
           pathname.includes('/js/') ||
           pathname.includes('/fonts/') ||
           pathname.includes('/assets/') ||
           pathname.endsWith('.css') ||
           pathname.endsWith('.js') ||
           pathname.endsWith('.woff') ||
           pathname.endsWith('.woff2') ||
           pathname.endsWith('.ttf');
}

// Check if request is for API
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') || url.pathname.includes('/data/');
}

// Handle image requests - Cache First strategy
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Return cached image and update in background
            updateImageInBackground(request, cache);
            return cachedResponse;
        }
        
        // Fetch and cache new image
        const response = await fetch(request);
        
        if (response.ok) {
            // Clone response before caching
            const responseClone = response.clone();
            await cache.put(request, responseClone);
            
            // Clean up old images if cache is getting too large
            await cleanupImageCache(cache);
        }
        
        return response;
    } catch (error) {
        console.error('Error handling image request:', error);
        // Return offline image placeholder
        return new Response(getOfflineImageSVG(), {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const response = await fetch(request);
        
        if (response.ok) {
            const responseClone = response.clone();
            await cache.put(request, responseClone);
        }
        
        return response;
    } catch (error) {
        console.error('Error handling static asset:', error);
        throw error;
    }
}

// Handle API requests - Network First strategy
async function handleAPIRequest(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            const responseClone = response.clone();
            await cache.put(request, responseClone);
        }
        
        return response;
    } catch (error) {
        console.error('Network request failed, trying cache:', error);
        
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Handle page requests - Network First with fallback
async function handlePageRequest(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            const responseClone = response.clone();
            await cache.put(request, responseClone);
        }
        
        return response;
    } catch (error) {
        console.error('Network request failed, trying cache:', error);
        
        // Try dynamic cache first
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        let cachedResponse = await dynamicCache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try static cache
        const staticCache = await caches.open(STATIC_CACHE);
        cachedResponse = await staticCache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        const url = new URL(request.url);
        if (url.pathname.endsWith('.html') || url.pathname === '/' || !url.pathname.includes('.')) {
            return createOfflinePage();
        }
        
        throw error;
    }
}

// Update image in background
async function updateImageInBackground(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
    } catch (error) {
        // Silently fail background updates
        console.log('Background image update failed:', error);
    }
}

// Clean up image cache to prevent unlimited growth
async function cleanupImageCache(cache) {
    const keys = await cache.keys();
    
    // If we have more than 100 images, remove the oldest ones
    if (keys.length > 100) {
        const responses = await Promise.all(
            keys.map(async key => {
                const response = await cache.match(key);
                return {
                    key,
                    date: response.headers.get('date') || '0'
                };
            })
        );
        
        // Sort by date and remove oldest 20
        responses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const toDelete = responses.slice(0, 20);
        
        await Promise.all(
            toDelete.map(item => cache.delete(item.key))
        );
        
        console.log(`🗑️ Cleaned up ${toDelete.length} old images from cache`);
    }
}

// Create offline page HTML
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Wali Wheels</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .offline-container {
                    max-width: 500px;
                    padding: 40px 20px;
                }
                .offline-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.7;
                }
                h1 {
                    font-size: 28px;
                    margin-bottom: 16px;
                    color: #00ff88;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    opacity: 0.8;
                    margin-bottom: 24px;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #00ff88, #22d3ee);
                    color: #0f172a;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>Sei offline</h1>
                <p>Non riesco a connettermi al server. Controlla la tua connessione internet e riprova.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    Riprova
                </button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Get offline image SVG
function getOfflineImageSVG() {
    return `
        <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f0f0f0"/>
            <rect x="50" y="50" width="300" height="200" fill="#e0e0e0" rx="8"/>
            <circle cx="120" cy="120" r="20" fill="#ccc"/>
            <polygon points="160,180 200,140 240,160 280,120 320,140 320,200 160,200" fill="#ddd"/>
            <text x="200" y="240" text-anchor="middle" fill="#999" font-size="14" font-family="Arial, sans-serif">
                Immagine non disponibile offline
            </text>
        </svg>
    `;
}

// Handle background sync (if supported)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('🔄 Performing background sync...');
    
    try {
        // Sync any pending data
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        
        // Re-validate cached content
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.put(request, response.clone());
                }
            } catch (error) {
                // Skip failed requests
                continue;
            }
        }
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Handle push notifications (if needed in the future)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Wali Wheels', {
                body: data.body || 'Hai una nuova notifica',
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/badge-72.png',
                tag: data.tag || 'default',
                data: data.data || {}
            })
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    console.log('📅 Performing periodic content sync...');
    
    try {
        // Update critical content
        const criticalUrls = ['/', '/esplora-macchine.html', '/api/cars'];
        const cache = await caches.open(DYNAMIC_CACHE);
        
        for (const url of criticalUrls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone());
                }
            } catch (error) {
                continue;
            }
        }
        
        console.log('✅ Periodic sync completed');
    } catch (error) {
        console.error('❌ Periodic sync failed:', error);
    }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        case 'PREFETCH_URL':
            if (payload.url) {
                prefetchUrl(payload.url);
            }
            break;
    }
});

// Get total cache size
async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
    }
    
    return totalSize;
}

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    console.log('🗑️ All caches cleared');
}

// Prefetch URL
async function prefetchUrl(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(url, response.clone());
            console.log('📥 Prefetched:', url);
        }
    } catch (error) {
        console.warn('Failed to prefetch:', url, error);
    }
}

console.log('🚀 Service Worker loaded successfully');

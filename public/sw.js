// Service Worker for Chronos Platform PWA
const CACHE_NAME = 'chronos-platform-v1.0.0'
const STATIC_CACHE_NAME = 'chronos-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'chronos-dynamic-v1.0.0'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/sweepstakes',
  '/deposit',
  '/withdraw',
  '/profile',
  '/notifications',
  '/history',
  '/audit',
  '/offline',
  '/manifest.json',
  '/favicon.ico'
]

// API routes to cache
const API_ROUTES = [
  '/api/auth/session',
  '/api/user/balance',
  '/api/sweepstakes',
  '/api/notifications'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Static files cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first, cache fallback
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first
    event.respondWith(handleStaticAssets(request))
  } else {
    // Pages - network first, cache fallback
    event.respondWith(handlePageRequest(request))
  }
})

// Handle API requests
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed for API, trying cache', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for critical APIs
    if (request.url.includes('/api/auth/session')) {
      return new Response(JSON.stringify({ user: null }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    throw error
  }
}

// Handle static assets
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', error)
    throw error
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed for page, trying cache', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Fallback offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chronos - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: #1a1a1a;
              color: #fff;
            }
            .offline-container {
              max-width: 400px;
              margin: 0 auto;
              padding: 2rem;
            }
            .offline-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .offline-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              color: #D4AF37;
            }
            .offline-message {
              margin-bottom: 2rem;
              opacity: 0.8;
            }
            .offline-button {
              background: #D4AF37;
              color: #1a1a1a;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">⚡</div>
            <h1 class="offline-title">Você está offline</h1>
            <p class="offline-message">
              Verifique sua conexão com a internet e tente novamente.
            </p>
            <button class="offline-button" onclick="window.location.reload()">
              Tentar Novamente
            </button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline actions when connection is restored
    console.log('Service Worker: Performing background sync')
    
    // Here you would sync any offline actions like:
    // - Pending deposits
    // - Chat messages
    // - Profile updates
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Chronos',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Chronos Platform', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

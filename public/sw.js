
// Service Worker for Push Notifications

const CACHE_NAME = 'asap-tracker-cache-v1';
const OFFLINE_URL = '/offline.html';

// Cache essential assets on install
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          OFFLINE_URL,
          '/',
          '/index.html',
          '/favicon.ico',
        ]);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the service worker takes control of all clients as soon as it's activated
  self.clients.claim();
});

// Handle fetch events for network-first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Network-first strategy for GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If we got a valid response, clone it and store it in the cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If the network request fails, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, serve the offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
              }
              // For other requests, just return a basic error response
              return new Response('Network error', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received:', event);
  
  let notificationData = {};
  
  try {
    if (event.data) {
      notificationData = event.data.json();
    }
  } catch (error) {
    console.error('Error parsing push notification data:', error);
    notificationData = {
      title: 'Flight Alert',
      body: 'You have a new flight alert.',
      icon: '/favicon.ico'
    };
  }
  
  // Ensure we have at least default values
  const title = notificationData.title || 'Flight Alert';
  const options = {
    body: notificationData.body || 'You have a new flight update.',
    icon: notificationData.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: notificationData.data || {},
    vibrate: [100, 50, 100],
    actions: notificationData.actions || [
      { action: 'explore', title: 'View Details' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  // Close the notification
  event.notification.close();
  
  // Handle notification action clicks
  if (event.action === 'explore') {
    // Custom action for exploring the detailed view
    const flightId = event.notification.data.flightId;
    
    if (flightId) {
      event.waitUntil(
        clients.openWindow(`/flight/${flightId}`)
      );
      return;
    }
  }
  
  // Default action: open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientsArr) => {
        // If a window is already open, focus it
        const hadWindowToFocus = clientsArr.some((client) => {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
          return false;
        });
        
        // If no window is open, open a new one
        if (!hadWindowToFocus) {
          clients.openWindow('/')
            .then((client) => client ? client.focus() : null);
        }
      })
  );
});

// Handle subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker] Push subscription changed');
  
  event.waitUntil(
    // Re-subscribe the user with the new subscription
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then((subscription) => {
        console.log('[Service Worker] New subscription:', subscription);
        
        // Send the new subscription to the server
        return fetch('/api/save-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });
      })
  );
});

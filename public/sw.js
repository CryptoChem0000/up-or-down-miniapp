// Service Worker for Web Push Notifications
self.addEventListener('push', (event) => {
  let data = {};
  try { 
    data = event.data?.json() || {}; 
  } catch (error) {
    console.error('Error parsing push data:', error);
  }
  
  const title = data.title || 'ETH Daily Poll';
  const body = data.body || 'New update available';
  const url = data.url || '/';
  const icon = '/icon-192.png';
  const badge = '/icon-64.png';
  
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
      requireInteraction: false,
      silent: false
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  // Optional: Track notification dismissal
  console.log('Notification closed:', event.notification.tag);
});

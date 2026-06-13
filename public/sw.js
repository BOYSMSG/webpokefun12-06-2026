self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        let isFocused = false;
        
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.focused) {
            isFocused = true;
            // Send message to client to show in-app toast
            client.postMessage({
              type: 'PUSH_NOTIFICATION',
              payload: data
            });
            break;
          }
        }
        
        // If no window is focused, show a system notification
        if (!isFocused) {
          return self.registration.showNotification(data.title, {
            body: data.message,
            icon: data.icon || '/images/logo.png',
            data: { url: data.url || '/' },
            vibrate: [200, 100, 200]
          });
        }
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

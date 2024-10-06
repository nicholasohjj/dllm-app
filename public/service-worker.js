// public/service-worker.js (this will be served from your public directory)
self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png',  // You can add an icon
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
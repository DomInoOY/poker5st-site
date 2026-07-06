// Service worker «Пятая улица» — только push-уведомления, без офлайн-кэша (сайт и так лёгкий).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'Пятая улица', body: '' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    data = { title: 'Пятая улица', body: event.data ? event.data.text() : '' };
  }
  const options = {
    body: data.body || '',
    icon: 'images/icon-192.png',
    badge: 'images/icon-192.png',
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Пятая улица', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => {
      const existing = list.find((c) => 'focus' in c);
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});

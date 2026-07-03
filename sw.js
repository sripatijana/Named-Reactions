/* Named Reactions — offline service worker.
   Caches the app shell so it opens with no network, every time. */
var CACHE = 'named-reactions-v1';
var ASSETS = ['./', 'index.html', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll fails as a unit if any file 404s; add individually so a
      // missing optional asset never blocks the install.
      return Promise.all(ASSETS.map(function (url) {
        return c.add(url).catch(function () {});
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // Cache successful same-origin responses for next time.
        try {
          if (res && res.status === 200 && res.type === 'basic') {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
        } catch (err) {}
        return res;
      }).catch(function () {
        // Offline and not cached: for navigations, fall back to the app shell.
        if (e.request.mode === 'navigate') return caches.match('index.html');
      });
    })
  );
});

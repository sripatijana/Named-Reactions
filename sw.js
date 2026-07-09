/* Named Reactions — offline service worker.
   Caches the app shell so it opens with no network, every time. */
var CACHE = 'named-reactions-v32';
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
  var url = new URL(e.request.url);
  var sameOrigin = url.origin === self.location.origin;

  // Network-first for same-origin requests: always try the live file when
  // online (so updates show immediately — no version bump needed), and fall
  // back to the cache only when the network is unavailable. Cross-origin
  // requests (fonts, CDNs) stay cache-first for speed.
  if (sameOrigin) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        try {
          if (res && res.status === 200 && res.type === 'basic') {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
        } catch (err) {}
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (hit) {
          if (hit) return hit;
          if (e.request.mode === 'navigate') return caches.match('index.html');
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        try {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
        } catch (err) {}
        return res;
      });
    })
  );
});

/* Pho House v2 service worker — cache-first app shell, versioned. */
const CACHE = "pho-house-v2";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./menu.js", "./manifest.webmanifest", "./favicon.svg", "./icon-192.svg", "./icon-512.svg"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(function (cached) {
    if (cached) return cached;
    return fetch(e.request).then(function (res) {
      var copy = res.clone();
      if (res.ok && e.request.url.indexOf(self.location.origin) === 0) {
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () { return caches.match("./index.html"); });
  }));
});

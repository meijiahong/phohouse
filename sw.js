/* Pho House service worker — cache-first app shell, versioned. */
const CACHE = "pho-house-v1";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./menu.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icon-192.svg",
  "./icon-512.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Never cache the service worker itself, and never cache Google Maps / fonts opaque responses aggressively.
  if (req.url.includes("sw.js")) return;
  if (req.url.includes("google.com/maps") || req.url.includes("fonts.googleapis") || req.url.includes("fonts.gstatic")) {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // Only cache same-origin successful responses.
        if (res.ok && new URL(req.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Offline fallback: serve the app shell for navigations.
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("Offline — please reconnect.", { status: 503, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});

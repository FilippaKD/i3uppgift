var cacheName = "offline-cache-v1";

async function networkResponse(request) {
  try {
    return await fetch(request);
  } catch {
    return (await cache.open(cacheName)).match("./offline.html");
  }
}

self.addEventListener("install", async (event) => {
  event.waitUntil(cache.open(cacheName).then(cache => cache.add("./offline.html")));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(networkResponse(event.request));
});
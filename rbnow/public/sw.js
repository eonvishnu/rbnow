const CACHE_NAME = "ec-fresh-v2"; // Changed to v2 to force update

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // 1. Ignore chrome-extension requests or anything not http
  if (!event.request.url.startsWith("http")) return;

  // 2. Network-first strategy (Try to get data, if offline, show message)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        // Fallback response if user is completely offline
        return new Response("You are currently offline.");
      })
  );
});
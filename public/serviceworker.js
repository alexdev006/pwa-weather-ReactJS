const CACHE_NAME = "version-1";

const urlsToCache = ["index.html", "offline.html"]; //on veut créer une page qui sera visible hors connexion

const self = this; //evite d'avoir une erreur lors de l'appel self.addEventListener

//install SW
//on veut ouvrir le cache et mettre urlsToCache dedans
//une fois le cache ouvert il faut vider le cache pour e clean
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened CACHE");

      return cache.addAll(urlsToCache);
    })
  );
});

//listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

//activate SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

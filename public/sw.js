// Service worker minimal — condition technique pour que le site soit
// considéré "installable" par les navigateurs (Chrome/Android notamment).
// Ne met rien en cache pour l'instant : chaque requête passe normalement
// par le réseau. Pourra être enrichi plus tard pour un vrai mode hors-ligne.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pas d'interception : on laisse passer toutes les requêtes normalement.
});

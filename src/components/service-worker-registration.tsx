"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'absence de service worker ne doit jamais empêcher le site de
      // fonctionner normalement — l'installabilité PWA est une amélioration,
      // pas une dépendance critique.
    });
  }, []);

  return null;
}

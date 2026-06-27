"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Accès discret à l'espace admin : pas de lien visible sur le site public.
 * - Desktop : Ctrl/Cmd + Shift + A
 * - Mobile/tablette : 5 taps rapides (moins de 2s) n'importe où sur l'écran
 *
 * Ce composant ne rend rien visuellement — il écoute simplement les
 * événements en arrière-plan pendant que le visiteur navigue.
 */
export function AdminAccessTrigger() {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const modifier = e.ctrlKey || e.metaKey;
      if (modifier && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin");
      }
    }

    function handleTouchStart() {
      tapCount.current += 1;

      if (tapTimer.current) clearTimeout(tapTimer.current);

      if (tapCount.current >= 5) {
        tapCount.current = 0;
        router.push("/admin");
        return;
      }

      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 2000);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, [router]);

  return null;
}

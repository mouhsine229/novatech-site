"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Accès discret à l'espace admin : pas de lien visible sur le site public.
 * - Desktop UNIQUEMENT : Ctrl/Cmd + Shift + A
 * - Mobile/tablette : désactivé volontairement
 *
 * Ce composant ne rend rien visuellement — il écoute simplement les
 * événements en arrière-plan sur desktop uniquement.
 */
export function AdminAccessTrigger() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const modifier = e.ctrlKey || e.metaKey;
      if (modifier && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null;
}

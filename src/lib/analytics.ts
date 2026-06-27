"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Enregistre une vue de page de façon minimaliste : aucun cookie, aucune
 * donnée personnelle, juste le chemin visité et l'horodatage. Sert de base
 * aux statistiques de fréquentation (cahier des charges, section 8).
 */
export async function trackPageView(path: string) {
  try {
    const supabase = await createClient();
    await supabase.from("page_views").insert({ path });
  } catch {
    // Le suivi de fréquentation ne doit jamais faire échouer le rendu de la page.
  }
}

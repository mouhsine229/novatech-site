"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitTestimonialResult = { success: boolean; error?: string };

export async function submitTestimonial(
  projectId: string,
  formData: FormData
): Promise<SubmitTestimonialResult> {
  const nom_client = String(formData.get("nom_client") ?? "").trim();
  const avis = String(formData.get("avis") ?? "").trim();
  const note = Number(formData.get("note") ?? 5);

  if (!nom_client || !avis) {
    return { success: false, error: "Merci de renseigner votre nom et votre avis." };
  }
  if (note < 1 || note > 5) {
    return { success: false, error: "La note doit être comprise entre 1 et 5." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    project_id: projectId,
    nom_client,
    entreprise: String(formData.get("entreprise") ?? "").trim() || null,
    avis,
    note,
    statut: "en_attente", // validation manuelle par l'admin avant publication
  });

  if (error) {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }

  return { success: true };
}

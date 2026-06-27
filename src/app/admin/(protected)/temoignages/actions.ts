"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

export async function validateTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update({ statut: "valide" }).eq("id", id);

  if (error) return { success: false, error: "Impossible de valider ce témoignage." };

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) return { success: false, error: "Impossible de supprimer ce témoignage." };

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  return { success: true };
}

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
  const nom_client = String(formData.get("nom_client") ?? "").trim();
  const avis = String(formData.get("avis") ?? "").trim();

  if (!nom_client || !avis) {
    return { success: false, error: "Le nom du client et l'avis sont obligatoires." };
  }

  const fields = {
    nom_client,
    avis,
    entreprise: String(formData.get("entreprise") ?? "").trim() || null,
    note: Number(formData.get("note") ?? 5) || 5,
    statut: "valide" as const, // saisie manuelle par l'admin = déjà validée
  };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(fields);

  if (error) return { success: false, error: "Une erreur est survenue lors de la création." };

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  return { success: true };
}

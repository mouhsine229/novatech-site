"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

export async function updateFounderProfile(id: string, formData: FormData): Promise<ActionResult> {
  const nom = String(formData.get("nom") ?? "").trim();
  const fonction = String(formData.get("fonction") ?? "").trim();

  if (!nom || !fonction) {
    return { success: false, error: "Le nom et la fonction sont obligatoires." };
  }

  const fields = {
    nom,
    fonction,
    biographie: String(formData.get("biographie") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    linkedin: String(formData.get("linkedin") ?? "").trim() || null,
    github: String(formData.get("github") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("founder_profile").update(fields).eq("id", id);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la mise à jour." };
  }

  revalidatePath("/admin/fondateur");
  revalidatePath("/a-propos");
  revalidatePath("/");
  return { success: true };
}

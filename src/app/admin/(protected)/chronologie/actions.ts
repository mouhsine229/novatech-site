"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

function parseTimelineForm(formData: FormData) {
  return {
    annee: Number(formData.get("annee") ?? new Date().getFullYear()),
    titre: String(formData.get("titre") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    ordre_affichage: Number(formData.get("ordre_affichage") ?? 0) || 0,
  };
}

export async function createTimelineEvent(formData: FormData): Promise<ActionResult> {
  const fields = parseTimelineForm(formData);
  if (!fields.titre) return { success: false, error: "Le titre est obligatoire." };

  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").insert(fields);
  if (error) return { success: false, error: "Une erreur est survenue lors de la création." };

  revalidatePath("/admin/chronologie");
  revalidatePath("/a-propos");
  redirect("/admin/chronologie");
}

export async function updateTimelineEvent(id: string, formData: FormData): Promise<ActionResult> {
  const fields = parseTimelineForm(formData);
  if (!fields.titre) return { success: false, error: "Le titre est obligatoire." };

  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").update(fields).eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue lors de la mise à jour." };

  revalidatePath("/admin/chronologie");
  revalidatePath("/a-propos");
  redirect("/admin/chronologie");
}

export async function deleteTimelineEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").delete().eq("id", id);
  if (error) return { success: false, error: "Impossible de supprimer cet événement." };

  revalidatePath("/admin/chronologie");
  revalidatePath("/a-propos");
  return { success: true };
}

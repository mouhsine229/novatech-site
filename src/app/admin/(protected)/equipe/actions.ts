"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

function parseTeamMemberForm(formData: FormData) {
  return {
    nom: String(formData.get("nom") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    telephone: String(formData.get("telephone") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    bio_courte: String(formData.get("bio_courte") ?? "").trim() || null,
    est_fondateur: formData.get("est_fondateur") === "on",
    ordre_affichage: Number(formData.get("ordre_affichage") ?? 0) || 0,
  };
}

export async function createTeamMember(formData: FormData): Promise<ActionResult> {
  const fields = parseTeamMemberForm(formData);
  if (!fields.nom || !fields.role) {
    return { success: false, error: "Le nom et le rôle sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").insert(fields);
  if (error) return { success: false, error: "Une erreur est survenue lors de la création." };

  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");
  redirect("/admin/equipe");
}

export async function updateTeamMember(id: string, formData: FormData): Promise<ActionResult> {
  const fields = parseTeamMemberForm(formData);
  if (!fields.nom || !fields.role) {
    return { success: false, error: "Le nom et le rôle sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update(fields).eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue lors de la mise à jour." };

  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");
  redirect("/admin/equipe");
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { success: false, error: "Impossible de supprimer ce membre." };

  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");
  return { success: true };
}

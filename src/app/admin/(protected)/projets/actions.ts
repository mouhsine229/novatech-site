"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ActionResult = { success: boolean; error?: string };

function parseProjectForm(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const statut = String(formData.get("statut") ?? "en_cours") as "en_cours" | "termine";
  const technologiesRaw = String(formData.get("technologies") ?? "").trim();
  const progressionRaw = String(formData.get("progression") ?? "").trim();

  return {
    nom,
    slug: slugify(nom),
    description: String(formData.get("description") ?? "").trim(),
    url_projet: String(formData.get("url_projet") ?? "").trim() || null,
    statut,
    progression: progressionRaw ? Math.min(100, Math.max(0, Number(progressionRaw))) : null,
    date_prevue: String(formData.get("date_prevue") ?? "").trim() || null,
    date_fin: String(formData.get("date_fin") ?? "").trim() || null,
    technologies: technologiesRaw ? technologiesRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
    client: String(formData.get("client") ?? "").trim() || null,
    image_principale: String(formData.get("image_principale") ?? "").trim() || null,
    categorie: String(formData.get("categorie") ?? "").trim() || null,
  };
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const fields = parseProjectForm(formData);
  if (!fields.nom || !fields.description) {
    return { success: false, error: "Le nom et la description sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(fields);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Un projet avec un nom très similaire existe déjà." };
    }
    return { success: false, error: "Une erreur est survenue lors de la création." };
  }

  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath("/projets-en-cours");
  revalidatePath("/");
  redirect("/admin/projets");
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  const fields = parseProjectForm(formData);
  if (!fields.nom || !fields.description) {
    return { success: false, error: "Le nom et la description sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la mise à jour." };
  }

  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath("/projets-en-cours");
  revalidatePath("/");
  redirect("/admin/projets");
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Impossible de supprimer ce projet." };
  }

  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath("/projets-en-cours");
  revalidatePath("/");
  return { success: true };
}

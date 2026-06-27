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

function parseArticleForm(formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  const publie = formData.get("publie") === "on";

  return {
    titre,
    slug: slugify(titre),
    extrait: String(formData.get("extrait") ?? "").trim() || null,
    contenu: String(formData.get("contenu") ?? "").trim(),
    image_couverture: String(formData.get("image_couverture") ?? "").trim() || null,
    publie,
    date_publication: publie ? new Date().toISOString() : null,
  };
}

export async function createArticle(formData: FormData): Promise<ActionResult> {
  const fields = parseArticleForm(formData);
  if (!fields.titre || !fields.contenu) {
    return { success: false, error: "Le titre et le contenu sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("articles").insert(fields);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la création." };
  }

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  redirect("/admin/actualites");
}

export async function updateArticle(id: string, formData: FormData): Promise<ActionResult> {
  const fields = parseArticleForm(formData);
  if (!fields.titre || !fields.contenu) {
    return { success: false, error: "Le titre et le contenu sont obligatoires." };
  }

  const supabase = await createClient();

  // Ne pas écraser la date de publication existante si l'article était déjà publié
  const { data: existing } = await supabase.from("articles").select("publie, date_publication").eq("id", id).maybeSingle();
  const date_publication =
    fields.publie && existing?.date_publication ? existing.date_publication : fields.date_publication;

  const { error } = await supabase
    .from("articles")
    .update({ ...fields, date_publication, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la mise à jour." };
  }

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  redirect("/admin/actualites");
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) return { success: false, error: "Impossible de supprimer cet article." };

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  return { success: true };
}

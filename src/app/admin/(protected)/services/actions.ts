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

const VALID_ICONS = ["Code2", "Bot", "Workflow", "LayoutDashboard", "GraduationCap"];

function parseServiceForm(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const icone = String(formData.get("icone") ?? "Code2").trim();
  return {
    nom,
    slug: slugify(nom),
    description: String(formData.get("description") ?? "").trim(),
    icone: VALID_ICONS.includes(icone) ? icone : "Code2",
    ordre_affichage: Number(formData.get("ordre_affichage") ?? 0) || 0,
  };
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const fields = parseServiceForm(formData);
  if (!fields.nom || !fields.description) {
    return { success: false, error: "Le nom et la description sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(fields);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la création." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  const fields = parseServiceForm(formData);
  if (!fields.nom || !fields.description) {
    return { success: false, error: "Le nom et la description sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").update(fields).eq("id", id);

  if (error) {
    return { success: false, error: "Une erreur est survenue lors de la mise à jour." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Impossible de supprimer ce service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

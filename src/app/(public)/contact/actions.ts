"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormResult = { success: boolean; error?: string };

export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const sujet = String(formData.get("sujet") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!nom || !email || !message) {
    return { success: false, error: "Merci de remplir tous les champs obligatoires." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, error: "Merci de renseigner une adresse email valide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    nom,
    email,
    sujet: sujet || null,
    message,
  });

  if (error) {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }

  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";

export type QuoteFormResult = { success: boolean; error?: string };

export async function submitQuoteRequest(formData: FormData): Promise<QuoteFormResult> {
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const type_projet = String(formData.get("type_projet") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!nom || !email || !type_projet || !description) {
    return { success: false, error: "Merci de remplir tous les champs obligatoires." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, error: "Merci de renseigner une adresse email valide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert({
    nom,
    email,
    entreprise: String(formData.get("entreprise") ?? "").trim() || null,
    type_projet,
    budget_indicatif: String(formData.get("budget_indicatif") ?? "").trim() || null,
    delai_souhaite: String(formData.get("delai_souhaite") ?? "").trim() || null,
    description,
  });

  if (error) {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }

  return { success: true };
}

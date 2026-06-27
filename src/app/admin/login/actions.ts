"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginResult = { success: boolean; error?: string };

export async function login(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, error: "Merci de renseigner votre email et votre mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Email ou mot de passe incorrect." };
  }

  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

export async function markQuoteAsRead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").update({ lu: true }).eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue." };
  revalidatePath("/admin/devis");
  return { success: true };
}

export async function deleteQuoteRequest(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue." };
  revalidatePath("/admin/devis");
  return { success: true };
}

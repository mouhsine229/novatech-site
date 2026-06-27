"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: boolean; error?: string };

export async function markAsRead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ lu: true }).eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue." };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { success: false, error: "Une erreur est survenue." };
  revalidatePath("/admin/messages");
  return { success: true };
}

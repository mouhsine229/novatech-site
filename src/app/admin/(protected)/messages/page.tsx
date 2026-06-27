import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/lib/types";
import { MessagesList } from "./messages-list";

export const metadata = { title: "Messages — Administration NOVATECH" };

async function getAllMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-ink">Messages</h1>
      <p className="mt-1 font-body text-sm text-slate">Messages reçus depuis le formulaire de contact du site.</p>

      <MessagesList messages={messages} />
    </div>
  );
}

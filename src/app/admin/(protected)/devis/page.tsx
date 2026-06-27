import { createClient } from "@/lib/supabase/server";
import { QuoteRequestsList } from "./quote-requests-list";

export const metadata = { title: "Devis — Administration NOVATECH" };

async function getAllQuoteRequests() {
  const supabase = await createClient();
  const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminQuotesPage() {
  const requests = await getAllQuoteRequests();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-ink">Demandes de devis</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Demandes détaillées reçues depuis le formulaire de devis du site.
      </p>

      <QuoteRequestsList requests={requests} />
    </div>
  );
}

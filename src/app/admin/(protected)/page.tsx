import Link from "next/link";
import { FolderKanban, MessageSquareQuote, Mail, FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCompanyStats } from "@/lib/queries";

export const metadata = { title: "Tableau de bord — Administration NOVATECH" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getCompanyStats();

  const [{ count: temoignagesEnAttente }, { count: messagesNonLus }, { count: devisNonLus }] = await Promise.all([
    supabase.from("testimonials").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("lu", false),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("lu", false),
  ]);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Tableau de bord</h1>
          <p className="mt-1 font-body text-sm text-slate">Vue d&rsquo;ensemble de NOVATECH</p>
        </div>
        <Link
          href="/admin/projets/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau projet
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projets terminés" value={stats.projetsTermines} />
        <StatCard label="Projets en cours" value={stats.projetsEnCours} />
        <StatCard label="Clients" value={stats.totalClients} />
        <StatCard label="Total projets" value={stats.totalProjets} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AlertCard
          href="/admin/temoignages"
          icon={MessageSquareQuote}
          label="Témoignages en attente"
          count={temoignagesEnAttente ?? 0}
        />
        <AlertCard
          href="/admin/messages"
          icon={Mail}
          label="Messages non lus"
          count={messagesNonLus ?? 0}
        />
        <AlertCard
          href="/admin/devis"
          icon={FileText}
          label="Devis non lus"
          count={devisNonLus ?? 0}
        />
      </div>

      <div className="mt-8 rounded-sm border border-border-light bg-paper p-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-5 w-5 text-signal" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-ink">Gérer le contenu</h2>
        </div>
        <p className="mt-2 font-body text-sm text-slate">
          Ajoutez ou modifiez vos projets, services, profil fondateur et témoignages depuis le menu
          de gauche. Toutes les modifications sont publiées immédiatement sur le site public.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-border-light bg-paper p-5">
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">{label}</p>
    </div>
  );
}

function AlertCard({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-sm border border-border-light bg-paper p-5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-signal" aria-hidden="true" />
        <span className="font-body text-sm text-ink">{label}</span>
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${
          count > 0 ? "bg-signal text-paper" : "bg-paper-soft text-slate"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

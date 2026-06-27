import { createClient } from "@/lib/supabase/server";
import { Eye, TrendingUp } from "lucide-react";

export const metadata = { title: "Statistiques — Administration NOVATECH" };

interface PageViewRow {
  path: string;
  created_at: string;
}

async function getPageViews(sinceDays: number): Promise<PageViewRow[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  const { data } = await supabase
    .from("page_views")
    .select("path, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  return data ?? [];
}

function topPaths(views: PageViewRow[], limit = 8) {
  const counts = new Map<string, number>();
  for (const v of views) {
    counts.set(v.path, (counts.get(v.path) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function viewsPerDay(views: PageViewRow[], days: number) {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }
  return Array.from(buckets.entries());
}

export default async function AdminStatsPage() {
  const views30 = await getPageViews(30);
  const top = topPaths(views30);
  const daily = viewsPerDay(views30, 30);
  const maxDaily = Math.max(1, ...daily.map(([, count]) => count));

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-ink">Statistiques</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Fréquentation du site sur les 30 derniers jours — suivi minimaliste, sans cookies.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-border-light bg-paper p-5">
          <div className="flex items-center gap-2 text-signal">
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wider">Vues (30 jours)</span>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{views30.length}</p>
        </div>
        <div className="rounded-sm border border-border-light bg-paper p-5">
          <div className="flex items-center gap-2 text-signal">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wider">Moyenne / jour</span>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-ink">
            {Math.round(views30.length / 30)}
          </p>
        </div>
      </div>

      {/* Graphique simple en barres, en SVG/HTML pur (pas de lib de chart) */}
      <div className="mt-8 rounded-sm border border-border-light bg-paper p-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-signal">Vues par jour</h2>
        <div className="mt-6 flex h-32 items-end gap-1">
          {daily.map(([day, count]) => (
            <div key={day} className="group relative flex-1">
              <div
                className="rounded-t-sm bg-signal/80 transition-colors group-hover:bg-signal"
                style={{ height: `${Math.max(4, (count / maxDaily) * 100)}%` }}
              />
              <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 font-mono text-[10px] text-paper opacity-0 group-hover:opacity-100">
                {day} · {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-border-light bg-paper p-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-signal">Pages les plus visitées</h2>
        <ul className="mt-4 divide-y divide-border-light">
          {top.map(([path, count]) => (
            <li key={path} className="flex items-center justify-between py-3">
              <span className="font-mono text-sm text-ink">{path}</span>
              <span className="font-mono text-xs text-slate-soft">{count} vues</span>
            </li>
          ))}
          {top.length === 0 && (
            <li className="py-3 font-body text-sm text-slate">Pas encore de données.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

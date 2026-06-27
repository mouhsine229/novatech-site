import Link from "next/link";
import { Plus } from "lucide-react";
import { getTimelineEvents } from "@/lib/queries";
import { TimelineTable } from "./timeline-table";

export const metadata = { title: "Chronologie — Administration NOVATECH" };

export default async function AdminTimelinePage() {
  const events = await getTimelineEvents();

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Chronologie</h1>
          <p className="mt-1 font-body text-sm text-slate">
            Gérez la frise chronologique affichée sur la page « À propos ».
          </p>
        </div>
        <Link
          href="/admin/chronologie/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvel événement
        </Link>
      </div>

      <TimelineTable events={events} />
    </div>
  );
}

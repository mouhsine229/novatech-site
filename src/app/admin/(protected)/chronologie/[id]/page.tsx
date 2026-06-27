import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { TimelineEvent } from "@/lib/types";
import { TimelineForm } from "../timeline-form";
import { updateTimelineEvent } from "../actions";

async function getEventById(id: string): Promise<TimelineEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("timeline_events").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditTimelineEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const boundUpdate = updateTimelineEvent.bind(null, event.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/chronologie" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour à la chronologie
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Modifier « {event.titre} »</h1>

      <div className="mt-8">
        <TimelineForm event={event} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}

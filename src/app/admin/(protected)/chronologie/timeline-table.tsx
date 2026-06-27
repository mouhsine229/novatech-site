"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { TimelineEvent } from "@/lib/types";
import { deleteTimelineEvent } from "./actions";

export function TimelineTable({ events }: { events: TimelineEvent[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTimelineEvent(id);
      setConfirmId(null);
    });
  }

  if (events.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucun événement pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {events.map((event) => (
        <li key={event.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <span className="font-mono text-xs text-signal">{event.annee}</span>
            <p className="font-display font-semibold text-ink">{event.titre}</p>
            {event.description && <p className="mt-1 font-body text-xs text-slate">{event.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            {confirmId === event.id ? (
              <>
                <span className="font-body text-xs text-slate">Confirmer ?</span>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={isPending}
                  className="rounded-sm bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-paper disabled:opacity-60"
                >
                  Oui, supprimer
                </button>
                <button onClick={() => setConfirmId(null)} className="rounded-sm border border-border-light px-3 py-1.5 font-mono text-xs">
                  Annuler
                </button>
              </>
            ) : (
              <>
                <Link href={`/admin/chronologie/${event.id}`} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink" aria-label={`Modifier ${event.titre}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => setConfirmId(event.id)} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal" aria-label={`Supprimer ${event.titre}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

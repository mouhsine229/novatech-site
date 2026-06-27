"use client";

import { useState, useTransition } from "react";
import type { TimelineEvent } from "@/lib/types";
import type { ActionResult } from "./actions";

export function TimelineForm({
  event,
  onSubmit,
}: {
  event?: TimelineEvent;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-slate">
            Année <span className="text-signal">*</span>
          </label>
          <input
            name="annee"
            type="number"
            required
            defaultValue={event?.annee ?? new Date().getFullYear()}
            className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-slate">Ordre d&rsquo;affichage</label>
          <input
            name="ordre_affichage"
            type="number"
            defaultValue={event?.ordre_affichage ?? 0}
            className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">
          Titre <span className="text-signal">*</span>
        </label>
        <input
          name="titre"
          required
          defaultValue={event?.titre}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={event?.description ?? ""}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : event ? "Mettre à jour" : "Ajouter l'événement"}
      </button>
    </form>
  );
}

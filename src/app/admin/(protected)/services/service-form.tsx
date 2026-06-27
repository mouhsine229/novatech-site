"use client";

import { useState, useTransition } from "react";
import type { Service } from "@/lib/types";
import type { ActionResult } from "./actions";

const ICON_OPTIONS = [
  { value: "Code2", label: "Code (développement)" },
  { value: "LayoutDashboard", label: "Tableau de bord (gestion)" },
  { value: "Bot", label: "Robot (IA)" },
  { value: "Workflow", label: "Flux (automatisation)" },
  { value: "GraduationCap", label: "Diplôme (formation)" },
];

export function ServiceForm({
  service,
  onSubmit,
}: {
  service?: Service;
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
      <div>
        <label htmlFor="nom" className="font-mono text-xs uppercase tracking-wider text-slate">
          Nom du service <span className="text-signal">*</span>
        </label>
        <input
          id="nom"
          name="nom"
          required
          defaultValue={service?.nom}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-slate">
          Description <span className="text-signal">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={service?.description}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label htmlFor="icone" className="font-mono text-xs uppercase tracking-wider text-slate">
          Icône
        </label>
        <select
          id="icone"
          name="icone"
          defaultValue={service?.icone ?? "Code2"}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        >
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ordre_affichage" className="font-mono text-xs uppercase tracking-wider text-slate">
          Ordre d&rsquo;affichage
        </label>
        <input
          id="ordre_affichage"
          name="ordre_affichage"
          type="number"
          defaultValue={service?.ordre_affichage ?? 0}
          className="mt-2 w-32 rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : service ? "Mettre à jour" : "Créer le service"}
      </button>
    </form>
  );
}

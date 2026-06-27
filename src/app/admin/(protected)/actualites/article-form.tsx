"use client";

import { useState, useTransition } from "react";
import type { Article } from "@/lib/types";
import type { ActionResult } from "./actions";

export function ArticleForm({
  article,
  onSubmit,
}: {
  article?: Article;
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
        <label className="font-mono text-xs uppercase tracking-wider text-slate">
          Titre <span className="text-signal">*</span>
        </label>
        <input
          name="titre"
          required
          defaultValue={article?.titre}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Extrait (résumé court)</label>
        <textarea
          name="extrait"
          rows={2}
          defaultValue={article?.extrait ?? ""}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">
          Contenu <span className="text-signal">*</span>
        </label>
        <textarea
          name="contenu"
          required
          rows={10}
          defaultValue={article?.contenu}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">URL image de couverture</label>
        <input
          name="image_couverture"
          type="url"
          defaultValue={article?.image_couverture ?? ""}
          placeholder="https://..."
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <label className="flex items-center gap-3 font-body text-sm text-ink">
        <input type="checkbox" name="publie" defaultChecked={article?.publie ?? false} className="h-4 w-4 accent-signal" />
        Publier cet article sur le site public
      </label>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : article ? "Mettre à jour" : "Créer l'article"}
      </button>
    </form>
  );
}

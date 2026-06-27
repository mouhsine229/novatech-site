"use client";

import { useState, useTransition } from "react";
import { Star, CheckCircle2, Send } from "lucide-react";
import { submitTestimonial } from "./actions";

export function TestimonialSubmitForm({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [note, setNote] = useState(5);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitTestimonial(projectId, formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center rounded-sm border border-success/30 bg-success/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Merci pour votre avis !</h2>
        <p className="mt-2 font-body text-sm text-slate">
          Votre témoignage a bien été reçu et sera publié après vérification.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <input type="hidden" name="note" value={note} />

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Votre note</label>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setNote(value)}
                aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star className={`h-7 w-7 ${value <= note ? "fill-signal text-signal" : "text-border-light"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom_client" className="font-mono text-xs uppercase tracking-wider text-slate">
            Votre nom <span className="text-signal">*</span>
          </label>
          <input
            id="nom_client"
            name="nom_client"
            required
            className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
          />
        </div>
        <div>
          <label htmlFor="entreprise" className="font-mono text-xs uppercase tracking-wider text-slate">
            Entreprise (optionnel)
          </label>
          <input
            id="entreprise"
            name="entreprise"
            className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
          />
        </div>
      </div>

      <div>
        <label htmlFor="avis" className="font-mono text-xs uppercase tracking-wider text-slate">
          Votre avis <span className="text-signal">*</span>
        </label>
        <textarea
          id="avis"
          name="avis"
          required
          rows={5}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Envoi…" : "Envoyer mon avis"}
        {!isPending && <Send className="h-4 w-4" aria-hidden="true" />}
      </button>
    </form>
  );
}

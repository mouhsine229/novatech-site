"use client";

import { useState, useTransition } from "react";
import { Check, Trash2, Star, Plus } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { validateTestimonial, deleteTestimonial, createTestimonial } from "./actions";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const enAttente = testimonials.filter((t) => t.statut === "en_attente");
  const valides = testimonials.filter((t) => t.statut === "valide");

  return (
    <div className="space-y-10">
      {enAttente.length > 0 && (
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-signal">
            En attente de validation ({enAttente.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {enAttente.map((t) => (
              <TestimonialRow key={t.id} testimonial={t} pending />
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wider text-signal">
            Témoignages publiés ({valides.length})
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {valides.map((t) => (
            <TestimonialRow key={t.id} testimonial={t} />
          ))}
          {valides.length === 0 && (
            <p className="font-body text-sm text-slate">Aucun témoignage publié pour le moment.</p>
          )}
        </ul>
      </div>

      <AddTestimonialForm />
    </div>
  );
}

function TestimonialRow({ testimonial, pending = false }: { testimonial: Testimonial; pending?: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleValidate() {
    startTransition(() => {
      void validateTestimonial(testimonial.id);
    });
  }
  function handleDelete() {
    startTransition(() => {
      void deleteTestimonial(testimonial.id);
    });
  }

  return (
    <li className="rounded-sm border border-border-light bg-paper p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-ink">{testimonial.nom_client}</p>
          {testimonial.entreprise && <p className="font-mono text-xs text-slate-soft">{testimonial.entreprise}</p>}
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < testimonial.note ? "fill-signal text-signal" : "text-border-light"}`}
              />
            ))}
          </div>
          <p className="mt-2 font-body text-sm text-slate">{testimonial.avis}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {pending && (
            <button
              onClick={handleValidate}
              disabled={isPending}
              className="rounded-sm bg-success p-2 text-paper disabled:opacity-60"
              aria-label="Valider"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal disabled:opacity-60"
            aria-label="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

function AddTestimonialForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTestimonial(formData);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-sm border border-border-light px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-signal hover:text-signal"
      >
        <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un témoignage manuellement
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-4 rounded-sm border border-border-light bg-paper p-6">
      <h3 className="font-display font-semibold text-ink">Ajouter un témoignage</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-slate">Nom du client</label>
          <input name="nom_client" required className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-2.5 font-body text-sm outline-none focus:border-signal" />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-slate">Entreprise</label>
          <input name="entreprise" className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-2.5 font-body text-sm outline-none focus:border-signal" />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Avis</label>
        <textarea name="avis" required rows={3} className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-2.5 font-body text-sm outline-none focus:border-signal" />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Note (1 à 5)</label>
        <input name="note" type="number" min={1} max={5} defaultValue={5} className="mt-2 w-24 rounded-sm border border-border-light bg-paper px-4 py-2.5 font-body text-sm outline-none focus:border-signal" />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="rounded-sm bg-ink px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60">
          {isPending ? "Ajout…" : "Ajouter"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-sm border border-border-light px-5 py-2.5 font-mono text-xs uppercase tracking-wider">
          Annuler
        </button>
      </div>
    </form>
  );
}

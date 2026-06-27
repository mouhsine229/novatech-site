import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className="scroll-mt-20 border-t border-border-light px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Témoignages</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">Ce qu&rsquo;ils en disent</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-sm border border-border-light bg-paper p-6">
              <Quote className="h-5 w-5 text-signal" aria-hidden="true" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.note ? "fill-signal text-signal" : "text-border-light"}`} />
                ))}
              </div>
              <blockquote className="mt-3 font-body text-sm text-slate">{t.avis}</blockquote>
              <figcaption className="mt-4 font-mono text-xs text-ink">
                {t.nom_client}
                {t.entreprise && <span className="text-slate-soft"> — {t.entreprise}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

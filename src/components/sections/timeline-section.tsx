import type { TimelineEvent } from "@/lib/types";

export function TimelineSection({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section id="histoire" className="scroll-mt-20 border-t border-border-light bg-paper-soft px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Notre histoire</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">Chronologie</h2>

        <ol className="mt-10 space-y-8 border-l border-border-light pl-6">
          {events.map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-signal" aria-hidden="true" />
              <span className="font-mono text-sm text-signal">{event.annee}</span>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">{event.titre}</h3>
              {event.description && (
                <p className="mt-1 font-body text-sm text-slate">{event.description}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { Link2, Code } from "lucide-react";
import type { FounderProfile } from "@/lib/types";

export function FounderSection({ founder }: { founder: FounderProfile | null }) {
  if (!founder) return null;

  return (
    <section id="fondateur" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Le mot du fondateur</p>
        <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-paper-soft">
            {founder.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={founder.photo_url} alt={founder.nom} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-slate-soft">
                {founder.nom.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">{founder.nom}</h2>
            <p className="mt-1 font-mono text-sm text-signal">{founder.fonction}</p>
            {founder.biographie && (
              <p className="mt-4 font-body text-slate leading-relaxed">{founder.biographie}</p>
            )}
            <div className="mt-4 flex gap-4">
              {founder.linkedin && (
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-signal" aria-label="LinkedIn">
                  <Link2 className="h-5 w-5" />
                </a>
              )}
              {founder.github && (
                <a href={founder.github} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-signal" aria-label="GitHub">
                  <Code className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

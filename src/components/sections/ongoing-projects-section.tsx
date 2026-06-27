import type { Project } from "@/lib/types";
import { StatusLed } from "@/components/ui/status-led";

export function OngoingProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="projets-en-cours" className="scroll-mt-20 border-t border-border-light bg-paper-soft px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">En développement</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">Projets en cours</h2>
        <p className="mt-3 max-w-2xl font-body text-sm text-slate">
          Les détails techniques et captures d&rsquo;écran seront publiés à leur sortie.
        </p>

        <ul className="mt-10 divide-y divide-border-light border-y border-border-light">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{project.nom}</h3>
                {project.categorie && (
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-soft">
                    {project.categorie}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-6">
                {project.date_prevue && (
                  <span className="font-mono text-xs text-slate-soft">
                    Prévu {new Date(project.date_prevue).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                  </span>
                )}
                <StatusLed statut="en_cours" progression={project.progression} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

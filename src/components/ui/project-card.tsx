import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { isNouveau } from "@/lib/types";
import { StatusLed } from "@/components/ui/status-led";
import { NewBadge } from "@/components/ui/new-badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/realisations/${project.slug}`}
      className="group block overflow-hidden rounded-sm border border-border-light bg-paper transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-soft">
        {project.image_principale ? (
          <>
            {/* Barre façon navigateur, cohérente avec DesktopFrame, pour
                suggérer "ceci est un site web" même dans la grille de liste. */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 bg-[#e7e5e0] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" aria-hidden="true" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image_principale}
              alt={`Capture du site ${project.nom}`}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div className="circuit-trace flex h-full w-full items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-soft">
              Capture à venir
            </span>
          </div>
        )}
        {isNouveau(project) && (
          <NewBadge className="absolute right-3 top-3 z-10" />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-ink">{project.nom}</h3>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-slate transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
            aria-hidden="true"
          />
        </div>

        <p className="mt-2 line-clamp-2 font-body text-sm text-slate">{project.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <StatusLed statut={project.statut} progression={project.progression} />
          {project.technologies?.length > 0 && (
            <span className="font-mono text-xs text-slate-soft">
              {project.technologies.slice(0, 2).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

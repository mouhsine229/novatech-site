"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Link2, Check } from "lucide-react";
import type { Project } from "@/lib/types";
import { StatusLed } from "@/components/ui/status-led";
import { deleteProject } from "./actions";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProject(id);
      setConfirmId(null);
    });
  }

  function handleCopyTestimonialLink(projectId: string) {
    const url = `${window.location.origin}/avis/${projectId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(projectId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  if (projects.length === 0) {
    return (
      <p className="mt-10 font-body text-sm text-slate">
        Aucun projet pour le moment. Cliquez sur « Nouveau projet » pour en ajouter un.
      </p>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {projects.map((project) => (
        <li key={project.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="font-display font-semibold text-ink">{project.nom}</p>
            <div className="mt-1 flex items-center gap-3">
              <StatusLed statut={project.statut} progression={project.progression} />
              <span className="font-mono text-xs text-slate-soft">/{project.slug}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {confirmId === project.id ? (
              <>
                <span className="font-body text-xs text-slate">Confirmer ?</span>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={isPending}
                  className="rounded-sm bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-paper disabled:opacity-60"
                >
                  Oui, supprimer
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="rounded-sm border border-border-light px-3 py-1.5 font-mono text-xs"
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                {project.statut === "termine" && (
                  <button
                    onClick={() => handleCopyTestimonialLink(project.id)}
                    className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink"
                    aria-label={`Copier le lien d'avis pour ${project.nom}`}
                    title="Copier le lien à envoyer au client pour recueillir son avis"
                  >
                    {copiedId === project.id ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                  </button>
                )}
                <Link
                  href={`/admin/projets/${project.id}`}
                  className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink"
                  aria-label={`Modifier ${project.nom}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setConfirmId(project.id)}
                  className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal"
                  aria-label={`Supprimer ${project.nom}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

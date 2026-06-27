import Link from "next/link";
import { Plus } from "lucide-react";
import { getProjects } from "@/lib/queries";
import { ProjectsTable } from "./projects-table";

export const metadata = { title: "Projets — Administration NOVATECH" };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Projets</h1>
          <p className="mt-1 font-body text-sm text-slate">
            Gérez vos réalisations et projets en cours.
          </p>
        </div>
        <Link
          href="/admin/projets/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau projet
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}

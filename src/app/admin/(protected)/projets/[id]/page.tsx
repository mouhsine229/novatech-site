import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProjectScreenshots } from "@/lib/queries";
import type { Project } from "@/lib/types";
import { ProjectForm } from "../project-form";
import { updateProject } from "../actions";
import { CaptureButton } from "../capture-button";

async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const screenshots = await getProjectScreenshots(project.id);
  const boundUpdate = updateProject.bind(null, project.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/projets" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour aux projets
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Modifier « {project.nom} »</h1>

      <div className="mt-6">
        <CaptureButton projectId={project.id} url={project.url_projet} />
      </div>

      {screenshots.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {screenshots.map((shot) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div key={shot.id} className="overflow-hidden rounded-sm border border-border-light">
              <img src={shot.url_image} alt={`Capture ${shot.type}`} className="aspect-[4/3] w-full object-cover" />
              <p className="bg-paper-soft px-2 py-1 text-center font-mono text-[10px] uppercase tracking-wider text-slate">
                {shot.type}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ProjectForm project={project} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { TestimonialSubmitForm } from "./testimonial-submit-form";

async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data;
}

export const metadata = { title: "Donnez votre avis — NOVATECH" };

export default async function TestimonialPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Votre avis compte</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Comment s&rsquo;est passé votre projet « {project.nom} » ?
        </h1>
        <p className="mt-4 font-body text-slate">
          Votre retour aide NOVATECH à s&rsquo;améliorer et permet à d&rsquo;autres clients de
          mieux nous connaître.
        </p>

        <div className="mt-10">
          <TestimonialSubmitForm projectId={project.id} />
        </div>
      </div>
    </section>
  );
}

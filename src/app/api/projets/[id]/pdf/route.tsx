import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { getProjectScreenshots } from "@/lib/queries";
import type { Project } from "@/lib/types";
import { ProjectPdfDocument } from "@/lib/pdf/project-pdf-document";

async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project || project.statut !== "termine") {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }

  const screenshots = await getProjectScreenshots(project.id);

  const buffer = await renderToBuffer(
    <ProjectPdfDocument project={project} screenshots={screenshots} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="novatech-${project.slug}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

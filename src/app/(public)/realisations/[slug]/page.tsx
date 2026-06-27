import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileDown } from "lucide-react";
import { getProjectBySlug, getProjectScreenshots } from "@/lib/queries";
import { StatusLed } from "@/components/ui/status-led";
import { DesktopFrame, TabletFrame, MobileFrame } from "@/components/ui/device-frames";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.nom} — Réalisations NOVATECH`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const screenshots = await getProjectScreenshots(project.id);
  const desktop = screenshots.find((s) => s.type === "desktop");
  const tablette = screenshots.find((s) => s.type === "tablette");
  const mobile = screenshots.find((s) => s.type === "mobile");
  const hasAnyScreenshot = Boolean(desktop || tablette || mobile);

  // Cas legacy : ni screenshots multi-format, ni image_principale —
  // on retombe sur l'ancien comportement (rien à afficher).
  const legacyFallback =
    screenshots.length === 0 && project.image_principale ? project.image_principale : null;

  return (
    <article className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/realisations" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
          <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Toutes les réalisations
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{project.nom}</h1>
            <div className="mt-3 flex items-center gap-4">
              <StatusLed statut={project.statut} progression={project.progression} />
              {project.date_fin && (
                <span className="font-mono text-xs text-slate-soft">
                  Livré le {new Date(project.date_fin).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.url_projet && (
              <a
                href={project.url_projet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal"
              >
                Voir le projet <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {project.statut === "termine" && (
              <a
                href={`/api/projets/${project.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-border-light px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
              >
                Fiche PDF <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Repli pour les projets créés avant l'introduction des captures
            multi-format (juste une image_principale, sans table screenshots). */}
        {legacyFallback && (
          <div className="mt-10">
            <DesktopFrame src={legacyFallback} alt={`Capture du site ${project.nom}`} />
          </div>
        )}

        {/* Aperçu par appareil — chaque capture dans un cadre réaliste */}
        {hasAnyScreenshot && (
          <div className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-signal">
              Aperçu sur tous les écrans
            </h2>
            <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-3">
              {desktop && (
                <div className="sm:col-span-3">
                  <DesktopFrame src={desktop.url_image} alt={`Capture desktop du site ${project.nom}`} />
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-slate-soft">
                    Ordinateur
                  </p>
                </div>
              )}
              {tablette && (
                <div className="flex flex-col items-center">
                  <TabletFrame src={tablette.url_image} alt={`Capture tablette du site ${project.nom}`} className="w-full max-w-[220px]" />
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-slate-soft">
                    Tablette
                  </p>
                </div>
              )}
              {mobile && (
                <div className="flex flex-col items-center">
                  <MobileFrame src={mobile.url_image} alt={`Capture mobile du site ${project.nom}`} className="w-full max-w-[160px]" />
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-slate-soft">
                    Mobile
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-12 grid gap-10 sm:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-signal">Description</h2>
            <p className="mt-3 font-body leading-relaxed text-slate">{project.description}</p>
          </div>

          <div className="space-y-6">
            {project.technologies?.length > 0 && (
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-signal">Technologies</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-border-light px-2.5 py-1 font-mono text-xs text-ink"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.client && (
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-signal">Client</h2>
                <p className="mt-3 font-body text-sm text-ink">{project.client}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

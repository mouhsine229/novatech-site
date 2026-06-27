import Link from "next/link";
import { ArrowRight, Code2, Bot, Workflow, LayoutDashboard, GraduationCap } from "lucide-react";
import { getHomePageData } from "@/lib/queries";
import { ProjectCard } from "@/components/ui/project-card";
import { AboutSection } from "@/components/sections/about-section";
import { FounderSection } from "@/components/sections/founder-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { OngoingProjectsSection } from "@/components/sections/ongoing-projects-section";
import { NewsSection } from "@/components/sections/news-section";

// Cache de 60 secondes : les données vitrine changent rarement (mise à jour
// via l'admin), donc on évite de re-requêter Supabase à chaque visite tout
// en restant à jour très rapidement après une modification.
export const revalidate = 60;

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Bot,
  Workflow,
  LayoutDashboard,
  GraduationCap,
};

export default async function HomePage() {
  const { founder, services, projectsTermines, projectsEnCours, timeline, testimonials, articles, stats } =
    await getHomePageData();

  return (
    <>
      {/* HÉRO */}
      <section className="circuit-trace relative overflow-hidden border-b border-border-light bg-ink text-paper">
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            Développement Web · Intelligence Artificielle · Automatisation
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
            Des solutions numériques qui fonctionnent, du premier déploiement
            à la mise à l&rsquo;échelle.
          </h1>
          <p className="mt-6 max-w-xl font-body text-base text-slate-soft sm:text-lg">
            NOVATECH conçoit et développe des sites, applications et automatisations
            sur mesure, adaptés aux réalités africaines et internationales.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#realisations"
              className="inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal-soft"
            >
              Voir les réalisations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-sm border border-paper/30 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper transition-colors hover:border-paper"
            >
              Démarrer un projet
            </a>
          </div>

          {/* Chiffres clés */}
          <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 sm:grid-cols-4">
            <StatItem value={stats.totalProjets} label="Projets réalisés" />
            <StatItem value={stats.totalClients} label="Clients accompagnés" />
            <StatItem value={stats.projetsTermines} label="Solutions déployées" />
            <StatItem value={new Date().getFullYear() - 2025 + 1} label="Année(s) d'expérience" />
          </dl>
        </div>
      </section>

      <AboutSection />
      <FounderSection founder={founder} />

      {/* RÉALISATIONS — toutes, pas un aperçu */}
      {projectsTermines.length > 0 && (
        <section id="realisations" className="scroll-mt-20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-xs uppercase tracking-wider text-signal">Réalisations</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Nos projets livrés</h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsTermines.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <OngoingProjectsSection projects={projectsEnCours} />

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" className="scroll-mt-20 border-t border-border-light bg-paper-soft px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-xs uppercase tracking-wider text-signal">Services</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Ce que nous faisons</h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = (service.icone && ICONS[service.icone]) || Code2;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group rounded-sm border border-border-light bg-paper p-6 transition-shadow hover:shadow-lg"
                  >
                    <Icon className="h-6 w-6 text-signal" />
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink">{service.nom}</h3>
                    <p className="mt-2 font-body text-sm text-slate">{service.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-ink group-hover:text-signal">
                      En savoir plus <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TimelineSection events={timeline} />
      <TestimonialsSection testimonials={testimonials} />
      <NewsSection articles={articles} />

      {/* CTA FINAL / CONTACT */}
      <section id="contact" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Un projet en tête ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-slate">
          Parlons de vos besoins et voyons comment NOVATECH peut vous accompagner.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-8 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            Nous contacter
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dd className="font-display text-4xl font-bold text-paper sm:text-5xl">{value}</dd>
      <dt className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-soft">{label}</dt>
    </div>
  );
}

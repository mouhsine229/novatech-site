import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, Bot, Workflow, LayoutDashboard, GraduationCap } from "lucide-react";
import { getServiceBySlug } from "@/lib/queries";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Bot,
  Workflow,
  LayoutDashboard,
  GraduationCap,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.nom} — NOVATECH`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = (service.icone && ICONS[service.icone]) || Code2;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/services" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
          <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Tous les services
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-ink">
            <Icon className="h-6 w-6 text-signal" />
          </span>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{service.nom}</h1>
        </div>

        <p className="mt-8 font-body text-lg leading-relaxed text-slate">{service.description}</p>

        <div className="mt-12 rounded-sm border border-border-light bg-paper-soft p-8">
          <h2 className="font-display text-lg font-semibold text-ink">Intéressé par ce service ?</h2>
          <p className="mt-2 font-body text-sm text-slate">
            Parlons de votre projet et voyons comment NOVATECH peut vous accompagner.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal"
          >
            Nous contacter <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

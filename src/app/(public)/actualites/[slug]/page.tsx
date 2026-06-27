import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getArticleBySlug } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.titre} — NOVATECH`,
    description: article.extrait ?? undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <Link href="/actualites" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
          <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Toutes les actualités
        </Link>

        {article.date_publication && (
          <p className="mt-6 font-mono text-xs text-slate-soft">
            {new Date(article.date_publication).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{article.titre}</h1>

        {article.image_couverture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_couverture}
            alt={article.titre}
            className="mt-8 w-full rounded-sm border border-border-light object-cover"
          />
        )}

        <div className="mt-8 whitespace-pre-wrap font-body leading-relaxed text-slate">
          {article.contenu}
        </div>
      </div>
    </article>
  );
}

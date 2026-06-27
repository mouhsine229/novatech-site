import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedArticles } from "@/lib/queries";

export const metadata = {
  title: "Actualités — NOVATECH",
  description: "Suivez les actualités de NOVATECH : nouveaux projets, évolutions et conseils technologiques.",
};

export default async function ActualitesPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Actualités</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Le journal de NOVATECH
        </h1>
        <p className="mt-4 max-w-2xl font-body text-slate">
          Nouveaux projets, évolutions de l&rsquo;entreprise et conseils technologiques.
        </p>

        {articles.length === 0 ? (
          <p className="mt-16 font-body text-slate">Aucun article publié pour le moment.</p>
        ) : (
          <ul className="mt-12 divide-y divide-border-light border-y border-border-light">
            {articles.map((article) => (
              <li key={article.id} className="py-8">
                <Link href={`/actualites/${article.slug}`} className="group">
                  {article.date_publication && (
                    <span className="font-mono text-xs text-slate-soft">
                      {new Date(article.date_publication).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <h2 className="mt-2 font-display text-2xl font-semibold text-ink group-hover:text-signal">
                    {article.titre}
                  </h2>
                  {article.extrait && <p className="mt-2 font-body text-sm text-slate">{article.extrait}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-ink group-hover:text-signal">
                    Lire l&rsquo;article <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

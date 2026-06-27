import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/types";

export function NewsSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="actualites" className="scroll-mt-20 border-t border-border-light px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-signal">Actualités</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Le journal de NOVATECH</h2>
          </div>
          <Link href="/actualites" className="inline-flex items-center gap-1 font-mono text-sm font-medium text-ink hover:text-signal">
            Tout voir <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 divide-y divide-border-light border-y border-border-light">
          {articles.map((article) => (
            <li key={article.id} className="py-6">
              <Link href={`/actualites/${article.slug}`} className="group">
                {article.date_publication && (
                  <span className="font-mono text-xs text-slate-soft">
                    {new Date(article.date_publication).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
                <h3 className="mt-1 font-display text-xl font-semibold text-ink group-hover:text-signal">
                  {article.titre}
                </h3>
                {article.extrait && <p className="mt-1 font-body text-sm text-slate">{article.extrait}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

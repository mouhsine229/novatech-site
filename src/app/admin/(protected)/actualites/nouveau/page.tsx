import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export const metadata = { title: "Nouvel article — Administration NOVATECH" };

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/actualites" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour aux actualités
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Nouvel article</h1>

      <div className="mt-8">
        <ArticleForm onSubmit={createArticle} />
      </div>
    </div>
  );
}

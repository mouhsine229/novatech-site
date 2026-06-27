import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { ArticleForm } from "../article-form";
import { updateArticle } from "../actions";

async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, article.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/actualites" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour aux actualités
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Modifier « {article.titre} »</h1>

      <div className="mt-8">
        <ArticleForm article={article} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}

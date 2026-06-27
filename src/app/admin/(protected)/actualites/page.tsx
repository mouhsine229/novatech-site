import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import { ArticlesTable } from "./articles-table";

export const metadata = { title: "Actualités — Administration NOVATECH" };

async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Actualités</h1>
          <p className="mt-1 font-body text-sm text-slate">Gérez les articles du blog NOVATECH.</p>
        </div>
        <Link
          href="/admin/actualites/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvel article
        </Link>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  );
}

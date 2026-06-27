"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Article } from "@/lib/types";
import { deleteArticle } from "./actions";

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteArticle(id);
      setConfirmId(null);
    });
  }

  if (articles.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucun article pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {articles.map((article) => (
        <li key={article.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display font-semibold text-ink">{article.titre}</p>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  article.publie ? "bg-success/15 text-success" : "bg-paper-soft text-slate"
                }`}
              >
                {article.publie ? "Publié" : "Brouillon"}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-slate-soft">/{article.slug}</p>
          </div>

          <div className="flex items-center gap-2">
            {confirmId === article.id ? (
              <>
                <span className="font-body text-xs text-slate">Confirmer ?</span>
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={isPending}
                  className="rounded-sm bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-paper disabled:opacity-60"
                >
                  Oui, supprimer
                </button>
                <button onClick={() => setConfirmId(null)} className="rounded-sm border border-border-light px-3 py-1.5 font-mono text-xs">
                  Annuler
                </button>
              </>
            ) : (
              <>
                <Link href={`/admin/actualites/${article.id}`} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink" aria-label={`Modifier ${article.titre}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => setConfirmId(article.id)} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal" aria-label={`Supprimer ${article.titre}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

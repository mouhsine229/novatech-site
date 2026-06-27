"use client";

import { useState, useTransition } from "react";
import { FileText, FileCheck, Trash2 } from "lucide-react";
import { markQuoteAsRead, deleteQuoteRequest } from "./actions";

interface QuoteRequest {
  id: string;
  nom: string;
  email: string;
  entreprise: string | null;
  type_projet: string;
  budget_indicatif: string | null;
  delai_souhaite: string | null;
  description: string;
  lu: boolean;
  created_at: string;
}

export function QuoteRequestsList({ requests }: { requests: QuoteRequest[] }) {
  const [isPending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);

  function handleOpen(request: QuoteRequest) {
    setOpenId(openId === request.id ? null : request.id);
    if (!request.lu) {
      startTransition(() => {
        void markQuoteAsRead(request.id);
      });
    }
  }

  function handleDelete(id: string) {
    startTransition(() => {
      void deleteQuoteRequest(id);
    });
  }

  if (requests.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucune demande de devis reçue pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {requests.map((request) => {
        const isOpen = openId === request.id;
        return (
          <li key={request.id}>
            <button
              onClick={() => handleOpen(request)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-paper-soft"
            >
              <div className="flex items-center gap-3">
                {request.lu ? (
                  <FileCheck className="h-4 w-4 shrink-0 text-slate-soft" aria-hidden="true" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                )}
                <div>
                  <p className={`font-body text-sm ${request.lu ? "text-slate" : "font-semibold text-ink"}`}>
                    {request.nom} <span className="text-slate-soft">— {request.type_projet}</span>
                  </p>
                  <p className="font-mono text-xs text-slate-soft">{request.email}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-soft">
                {new Date(request.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border-light bg-paper-soft px-5 py-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {request.entreprise && (
                    <Detail label="Entreprise" value={request.entreprise} />
                  )}
                  <Detail label="Type de projet" value={request.type_projet} />
                  {request.budget_indicatif && <Detail label="Budget indicatif" value={request.budget_indicatif} />}
                  {request.delai_souhaite && <Detail label="Délai souhaité" value={request.delai_souhaite} />}
                </div>
                <p className="mt-4 whitespace-pre-wrap font-body text-sm text-ink">{request.description}</p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={`mailto:${request.email}`}
                    className="rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
                  >
                    Répondre par email
                  </a>
                  <button
                    onClick={() => handleDelete(request.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 rounded-sm border border-border-light px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Supprimer
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-soft">{label}</p>
      <p className="font-body text-sm text-ink">{value}</p>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/lib/types";
import { deleteService } from "./actions";

export function ServicesTable({ services }: { services: Service[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteService(id);
      setConfirmId(null);
    });
  }

  if (services.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucun service pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {services.map((service) => (
        <li key={service.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display font-semibold text-ink">{service.nom}</p>
            <p className="mt-1 font-mono text-xs text-slate-soft">/{service.slug}</p>
          </div>

          <div className="flex items-center gap-2">
            {confirmId === service.id ? (
              <>
                <span className="font-body text-xs text-slate">Confirmer ?</span>
                <button
                  onClick={() => handleDelete(service.id)}
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
                <Link href={`/admin/services/${service.id}`} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink" aria-label={`Modifier ${service.nom}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => setConfirmId(service.id)} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal" aria-label={`Supprimer ${service.nom}`}>
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

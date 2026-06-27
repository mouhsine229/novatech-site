"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Star } from "lucide-react";
import type { TeamMember } from "@/lib/types";
import { deleteTeamMember } from "./actions";

export function TeamMembersTable({ members }: { members: TeamMember[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTeamMember(id);
      setConfirmId(null);
    });
  }

  if (members.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucun membre d&rsquo;équipe pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {members.map((member) => (
        <li key={member.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display font-semibold text-ink">{member.nom}</p>
              {member.est_fondateur && <Star className="h-3.5 w-3.5 fill-signal text-signal" />}
            </div>
            <p className="mt-1 font-mono text-xs text-slate-soft">{member.role}</p>
          </div>

          <div className="flex items-center gap-2">
            {confirmId === member.id ? (
              <>
                <span className="font-body text-xs text-slate">Confirmer ?</span>
                <button
                  onClick={() => handleDelete(member.id)}
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
                <Link href={`/admin/equipe/${member.id}`} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-ink" aria-label={`Modifier ${member.nom}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => setConfirmId(member.id)} className="rounded-sm p-2 text-slate hover:bg-paper-soft hover:text-signal" aria-label={`Supprimer ${member.nom}`}>
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

import Link from "next/link";
import { Plus } from "lucide-react";
import { getTeamMembers } from "@/lib/queries";
import { TeamMembersTable } from "./team-members-table";

export const metadata = { title: "Équipe — Administration NOVATECH" };

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Équipe</h1>
          <p className="mt-1 font-body text-sm text-slate">
            Gérez les membres affichés sur la page « Notre équipe », avec leur contact direct.
          </p>
        </div>
        <Link
          href="/admin/equipe/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un membre
        </Link>
      </div>

      <TeamMembersTable members={members} />
    </div>
  );
}

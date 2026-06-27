import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamMemberForm } from "../team-member-form";
import { createTeamMember } from "../actions";

export const metadata = { title: "Nouveau membre — Administration NOVATECH" };

export default function NewTeamMemberPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/equipe" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour à l&rsquo;équipe
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Ajouter un membre</h1>

      <div className="mt-8">
        <TeamMemberForm onSubmit={createTeamMember} />
      </div>
    </div>
  );
}

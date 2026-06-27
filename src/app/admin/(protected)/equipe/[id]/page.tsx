import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types";
import { TeamMemberForm } from "../team-member-form";
import { updateTeamMember } from "../actions";

async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  const boundUpdate = updateTeamMember.bind(null, member.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/equipe" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour à l&rsquo;équipe
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Modifier « {member.nom} »</h1>

      <div className="mt-8">
        <TeamMemberForm member={member} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}

import { Mail, Phone, Star } from "lucide-react";
import { getTeamMembers } from "@/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Notre équipe — NOVATECH",
  description: "Contactez directement le fondateur ou un membre de l'équipe NOVATECH.",
};

export default async function EquipePage() {
  const members = await getTeamMembers();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Équipe</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Parlez directement à la bonne personne
        </h1>
        <p className="mt-4 max-w-2xl font-body text-slate">
          Chaque membre de NOVATECH peut être contacté directement selon votre besoin.
        </p>

        {members.length === 0 ? (
          <p className="mt-16 font-body text-slate">L&rsquo;équipe sera bientôt présentée ici.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {members.map((member) => (
              <div key={member.id} className="rounded-sm border border-border-light bg-paper p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-paper-soft">
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo_url} alt={member.nom} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-slate-soft">
                        {member.nom.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-semibold text-ink">{member.nom}</h2>
                      {member.est_fondateur && (
                        <Star className="h-3.5 w-3.5 fill-signal text-signal" aria-label="Fondateur" />
                      )}
                    </div>
                    <p className="font-mono text-xs uppercase tracking-wider text-signal">{member.role}</p>
                  </div>
                </div>

                {member.bio_courte && (
                  <p className="mt-4 font-body text-sm text-slate">{member.bio_courte}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
                    </a>
                  )}
                  {member.telephone && (
                    <a
                      href={`tel:${member.telephone}`}
                      className="inline-flex items-center gap-2 rounded-sm border border-border-light px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-signal hover:text-signal"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Appeler
                    </a>
                  )}
                  {!member.email && !member.telephone && (
                    <p className="font-body text-xs text-slate-soft">
                      Contact disponible via le formulaire général.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { getFounderProfile } from "@/lib/queries";
import { FounderForm } from "./founder-form";

export const metadata = { title: "Fondateur — Administration NOVATECH" };

export default async function AdminFounderPage() {
  const founder = await getFounderProfile();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-ink">Profil fondateur</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Ce contenu apparaît sur la page « À propos » du site public.
      </p>

      <div className="mt-8">
        {founder ? (
          <FounderForm founder={founder} />
        ) : (
          <p className="font-body text-sm text-slate">
            Aucun profil fondateur trouvé. Vérifiez que la table <code className="font-mono">founder_profile</code>{" "}
            contient bien une ligne (voir le script SQL initial).
          </p>
        )}
      </div>
    </div>
  );
}

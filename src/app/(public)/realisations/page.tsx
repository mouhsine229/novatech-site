import { redirect } from "next/navigation";

// La liste des réalisations vit maintenant sur la page d'accueil
// (#realisations). Les pages de détail /realisations/[slug] restent
// indépendantes (SEO, partage de lien, fiche PDF).
export default function RealisationsListRedirect() {
  redirect("/#realisations");
}

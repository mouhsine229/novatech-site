import { redirect } from "next/navigation";

// La liste des services vit maintenant sur la page d'accueil (#services).
// Les pages de détail /services/[slug] restent indépendantes (SEO).
export default function ServicesListRedirect() {
  redirect("/#services");
}

import { redirect } from "next/navigation";

// Contenu déplacé sur la page d'accueil (section #projets-en-cours).
export default function ProjetsEnCoursRedirect() {
  redirect("/#projets-en-cours");
}

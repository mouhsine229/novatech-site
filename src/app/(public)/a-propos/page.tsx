import { redirect } from "next/navigation";

// Le contenu "À propos" vit maintenant directement sur la page d'accueil
// (section #a-propos), conformément au nouveau design "tout-en-un". Cette
// route est conservée pour ne pas casser d'anciens liens partagés.
export default function AProposRedirect() {
  redirect("/#a-propos");
}

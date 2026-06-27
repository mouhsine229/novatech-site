import { Logo } from "@/components/ui/logo";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Connexion — Administration NOVATECH",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo className="h-8 w-auto" dark />
        </div>
        <h1 className="mt-8 text-center font-display text-xl font-semibold text-paper">
          Espace d&rsquo;administration
        </h1>
        <p className="mt-2 text-center font-body text-sm text-slate-soft">
          Connectez-vous pour gérer le contenu du site.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { login } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-slate-soft">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-sm border border-border bg-ink-soft px-4 py-3 font-body text-sm text-paper outline-none focus:border-signal"
        />
      </div>
      <div>
        <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-slate-soft">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-sm border border-border bg-ink-soft px-4 py-3 font-body text-sm text-paper outline-none focus:border-signal"
        />
      </div>

      {error && <p className="font-body text-sm text-signal-soft">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-signal px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal-soft disabled:opacity-60"
      >
        {isPending ? "Connexion…" : "Se connecter"}
        {!isPending && <LogIn className="h-4 w-4" aria-hidden="true" />}
      </button>
    </form>
  );
}

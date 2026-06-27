"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "./actions";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center rounded-sm border border-success/30 bg-success/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Message envoyé</h2>
        <p className="mt-2 font-body text-sm text-slate">
          Merci, votre message a bien été reçu. Nous vous répondrons dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="nom" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Sujet" name="sujet" />
      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-slate">
          Message <span className="text-signal">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
        {!isPending && <Send className="h-4 w-4" aria-hidden="true" />}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-wider text-slate">
        {label} {required && <span className="text-signal">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
      />
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitQuoteRequest } from "./actions";

const TYPES_PROJET = [
  "Site web vitrine",
  "Application de gestion",
  "Intelligence artificielle / Chatbot",
  "Automatisation de processus",
  "Formation",
  "Autre",
];

const BUDGETS = ["Moins de 500 000 FCFA", "500 000 — 2 000 000 FCFA", "2 000 000 — 5 000 000 FCFA", "Plus de 5 000 000 FCFA", "Je ne sais pas encore"];

const DELAIS = ["Le plus rapidement possible", "Dans le mois", "Dans les 3 mois", "Pas de contrainte de délai"];

export function QuoteForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitQuoteRequest(formData);
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
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Demande envoyée</h2>
        <p className="mt-2 font-body text-sm text-slate">
          Merci, votre demande de devis a bien été reçue. NOVATECH vous répondra rapidement
          avec une estimation adaptée à votre besoin.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="nom" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Entreprise (optionnel)" name="entreprise" />

      <Select label="Type de projet" name="type_projet" options={TYPES_PROJET} required />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Budget indicatif" name="budget_indicatif" options={BUDGETS} />
        <Select label="Délai souhaité" name="delai_souhaite" options={DELAIS} />
      </div>

      <div>
        <label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-slate">
          Décrivez votre projet <span className="text-signal">*</span>
        </label>
        <textarea
          id="description"
          name="description"
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
        {isPending ? "Envoi en cours…" : "Demander un devis"}
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

function Select({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-wider text-slate">
        {label} {required && <span className="text-signal">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
      >
        <option value="" disabled>
          Sélectionner...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

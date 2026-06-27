"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import type { FounderProfile } from "@/lib/types";
import { updateFounderProfile } from "./actions";

export function FounderForm({ founder }: { founder: FounderProfile }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateFounderProfile(founder.id, formData);
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="nom" required defaultValue={founder.nom} />
        <Field label="Fonction" name="fonction" required defaultValue={founder.fonction} />
      </div>

      <div>
        <label htmlFor="biographie" className="font-mono text-xs uppercase tracking-wider text-slate">
          Biographie / présentation
        </label>
        <textarea
          id="biographie"
          name="biographie"
          rows={6}
          defaultValue={founder.biographie ?? ""}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <Field label="URL de la photo de profil" name="photo_url" type="url" defaultValue={founder.photo_url ?? ""} placeholder="https://..." />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="LinkedIn" name="linkedin" type="url" defaultValue={founder.linkedin ?? ""} placeholder="https://linkedin.com/in/..." />
        <Field label="GitHub" name="github" type="url" defaultValue={founder.github ?? ""} placeholder="https://github.com/..." />
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}
      {saved && (
        <p className="flex items-center gap-2 font-body text-sm text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Profil mis à jour avec succès.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
      />
    </div>
  );
}

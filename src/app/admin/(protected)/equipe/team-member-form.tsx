"use client";

import { useState, useTransition } from "react";
import type { TeamMember } from "@/lib/types";
import type { ActionResult } from "./actions";

export function TeamMemberForm({
  member,
  onSubmit,
}: {
  member?: TeamMember;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="nom" required defaultValue={member?.nom} />
        <Field label="Rôle / fonction" name="role" required defaultValue={member?.role} placeholder="Fondateur, Support technique..." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" defaultValue={member?.email ?? ""} />
        <Field label="Téléphone" name="telephone" type="tel" defaultValue={member?.telephone ?? ""} placeholder="+229..." />
      </div>

      <Field label="URL de la photo" name="photo_url" type="url" defaultValue={member?.photo_url ?? ""} placeholder="https://..." />

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-slate">Courte description</label>
        <textarea
          name="bio_courte"
          rows={2}
          defaultValue={member?.bio_courte ?? ""}
          placeholder="Pour quel type de demande contacter cette personne ?"
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 font-body text-sm text-ink">
          <input type="checkbox" name="est_fondateur" defaultChecked={member?.est_fondateur ?? false} className="h-4 w-4 accent-signal" />
          Fondateur
        </label>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-slate">Ordre d&rsquo;affichage</label>
          <input
            name="ordre_affichage"
            type="number"
            defaultValue={member?.ordre_affichage ?? 0}
            className="ml-3 w-20 rounded-sm border border-border-light bg-paper px-3 py-1.5 font-body text-sm text-ink outline-none focus:border-signal"
          />
        </div>
      </div>

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : member ? "Mettre à jour" : "Ajouter ce membre"}
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

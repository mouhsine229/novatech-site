"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";
import type { ActionResult } from "./actions";
import { generateProjectDescription } from "./ai-actions";

export function ProjectForm({
  project,
  onSubmit,
}: {
  project?: Project;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [statut, setStatut] = useState<"en_cours" | "termine">(project?.statut ?? "en_cours");
  const [nom, setNom] = useState(project?.nom ?? "");
  const [urlProjet, setUrlProjet] = useState(project?.url_projet ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  function handleGenerateDescription() {
    setAiError(null);
    startGenerating(async () => {
      const result = await generateProjectDescription(nom, urlProjet);
      if (result.success && result.description) {
        setDescription(result.description);
      } else {
        setAiError(result.error ?? "La génération a échoué.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Field label="Nom du projet" name="nom" required value={nom} onChange={setNom} />

      <Field label="URL du projet" name="url_projet" type="url" value={urlProjet} onChange={setUrlProjet} placeholder="https://..." />

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-slate">
            Description <span className="text-signal">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGenerating || !nom}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border-light px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink hover:border-signal hover:text-signal disabled:opacity-50"
            title={!nom ? "Renseigne d'abord le nom du projet" : "Générer une proposition avec l'IA"}
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            )}
            {isGenerating ? "Génération…" : "Générer par IA"}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
        />
        {aiError && <p className="mt-1.5 font-body text-xs text-signal">{aiError}</p>}
        <p className="mt-1.5 font-body text-xs text-slate-soft">
          Le texte généré est une proposition à relire et ajuster avant publication.
        </p>
      </div>

      <Field
        label="URL de l'image principale (capture)"
        name="image_principale"
        type="url"
        defaultValue={project?.image_principale ?? ""}
        placeholder="https://..."
      />

      <div>
        <span className="font-mono text-xs uppercase tracking-wider text-slate">Statut</span>
        <div className="mt-2 flex gap-3">
          <RadioOption name="statut" value="en_cours" current={statut} onChange={setStatut} label="En cours" />
          <RadioOption name="statut" value="termine" current={statut} onChange={setStatut} label="Terminé" />
        </div>
      </div>

      {statut === "en_cours" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Catégorie" name="categorie" defaultValue={project?.categorie ?? ""} placeholder="Intelligence Artificielle" />
          <Field
            label="Progression (%)"
            name="progression"
            type="number"
            min={0}
            max={100}
            defaultValue={project?.progression ?? ""}
          />
          <Field label="Date prévue" name="date_prevue" type="date" defaultValue={project?.date_prevue ?? ""} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date de réalisation" name="date_fin" type="date" defaultValue={project?.date_fin ?? ""} />
          <Field label="Client (optionnel)" name="client" defaultValue={project?.client ?? ""} />
        </div>
      )}

      <Field
        label="Technologies (séparées par des virgules)"
        name="technologies"
        defaultValue={project?.technologies?.join(", ") ?? ""}
        placeholder="Next.js, Supabase, Tailwind"
      />

      {error && <p className="font-body text-sm text-signal">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
        >
          {isPending ? "Enregistrement…" : project ? "Mettre à jour" : "Créer le projet"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  const isControlled = value !== undefined && onChange !== undefined;
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
        {...(isControlled
          ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) }
          : { defaultValue })}
        placeholder={placeholder}
        min={min}
        max={max}
        className="mt-2 w-full rounded-sm border border-border-light bg-paper px-4 py-3 font-body text-sm text-ink outline-none focus:border-signal"
      />
    </div>
  );
}

function RadioOption({
  name,
  value,
  current,
  onChange,
  label,
}: {
  name: string;
  value: "en_cours" | "termine";
  current: string;
  onChange: (v: "en_cours" | "termine") => void;
  label: string;
}) {
  return (
    <label
      className={`cursor-pointer rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
        current === value
          ? "border-signal bg-signal text-paper"
          : "border-border-light bg-paper text-slate hover:border-signal"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

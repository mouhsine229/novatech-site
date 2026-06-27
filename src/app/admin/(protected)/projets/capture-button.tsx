"use client";

import { useState, useTransition } from "react";
import { Camera, CheckCircle2, AlertTriangle } from "lucide-react";
import { triggerCapture } from "./capture-actions";

export function CaptureButton({ projectId, url }: { projectId: string; url: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(
    null
  );

  function handleClick() {
    if (!url) {
      setMessage({ type: "error", text: "Renseigne et enregistre d'abord l'URL du projet." });
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await triggerCapture(projectId, url);
      if (result.success) {
        setMessage({
          type: result.partial ? "warning" : "success",
          text: result.partial
            ? "Capture effectuée, mais certains formats ont échoué (voir les logs du service)."
            : "Captures générées avec succès (desktop, tablette, mobile).",
        });
      } else {
        setMessage({ type: "error", text: result.error ?? "Une erreur est survenue." });
      }
    });
  }

  return (
    <div className="rounded-sm border border-border-light bg-paper-soft p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Capture automatique</h3>
          <p className="mt-1 font-body text-xs text-slate">
            Génère automatiquement les captures desktop, tablette et mobile à partir de l&rsquo;URL du projet.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal disabled:opacity-60"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Capture en cours…" : "Capturer maintenant"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 flex items-center gap-2 font-body text-xs ${
            message.type === "success"
              ? "text-success"
              : message.type === "warning"
                ? "text-signal"
                : "text-signal"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          {message.text}
        </p>
      )}
    </div>
  );
}

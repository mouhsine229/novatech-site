import type { ProjectStatus } from "@/lib/types";

const LABELS: Record<ProjectStatus, string> = {
  termine: "Terminé",
  en_cours: "En cours",
};

export function StatusLed({
  statut,
  progression,
  className = "",
}: {
  statut: ProjectStatus;
  progression?: number | null;
  className?: string;
}) {
  const variant = statut === "termine" ? "success" : "progress";
  const label =
    statut === "en_cours" && typeof progression === "number"
      ? `${LABELS.en_cours} · ${progression}%`
      : LABELS[statut];

  return (
    <span className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${className}`}>
      <span className={`led-dot led-dot--${variant}`} aria-hidden="true" />
      {label}
    </span>
  );
}

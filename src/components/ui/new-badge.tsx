export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-signal px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-paper ${className}`}
    >
      Nouveau
    </span>
  );
}

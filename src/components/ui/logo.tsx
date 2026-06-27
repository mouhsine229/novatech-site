export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const lineColor = dark ? "#F5F3EC" : "#0B0E14";
  return (
    <svg
      viewBox="0 0 160 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NOVATECH"
    >
      {/* Noeud de circuit stylisé en N */}
      <g>
        <path
          d="M2 28V4L14 28V4"
          stroke="#E8542C"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="2" cy="4" r="2" fill="#E8542C" />
        <circle cx="14" cy="28" r="2" fill="#1FA67A" />
      </g>
      <text
        x="24"
        y="23"
        fontFamily="var(--font-display)"
        fontSize="19"
        fontWeight="700"
        letterSpacing="0.5"
        fill={lineColor}
      >
        NOVATECH
      </text>
    </svg>
  );
}

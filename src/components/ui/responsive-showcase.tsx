import { DesktopFrame, TabletFrame, MobileFrame } from "@/components/ui/device-frames";
import type { ProjectScreenshot } from "@/lib/types";

/**
 * Présente les 3 captures (desktop/tablette/mobile) ensemble dans une seule
 * composition, le desktop en arrière-plan et la tablette/mobile devant en
 * overlap — l'effet "vitrine responsive" classique des sites d'agences.
 * Si une seule capture existe (legacy, avant l'introduction des mockups),
 * affiche simplement cette capture seule sans cadre composé.
 */
export function ResponsiveShowcase({
  screenshots,
  projectName,
  className = "",
}: {
  screenshots: ProjectScreenshot[];
  projectName: string;
  className?: string;
}) {
  const desktop = screenshots.find((s) => s.type === "desktop");
  const tablette = screenshots.find((s) => s.type === "tablette");
  const mobile = screenshots.find((s) => s.type === "mobile");

  // Cas de base : aucune capture multi-format disponible (legacy ou
  // capture pas encore lancée) — pas de composition à afficher ici.
  if (!desktop && !tablette && !mobile) return null;

  // Si on n'a que le desktop (cas le plus fréquent avant la 1ère capture
  // multi-format), on l'affiche simplement dans son cadre, sans superposer
  // des cadres vides pour les autres formats.
  if (desktop && !tablette && !mobile) {
    return (
      <DesktopFrame
        src={desktop.url_image}
        alt={`Capture du site ${projectName}`}
        className={className}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {desktop && (
        <DesktopFrame
          src={desktop.url_image}
          alt={`Capture desktop du site ${projectName}`}
          className="w-full"
        />
      )}

      <div className="pointer-events-none absolute -bottom-6 left-0 flex items-end gap-3 sm:-bottom-10 sm:gap-4">
        {tablette && (
          <TabletFrame
            src={tablette.url_image}
            alt={`Capture tablette du site ${projectName}`}
            className="w-20 shrink-0 sm:w-28"
          />
        )}
        {mobile && (
          <MobileFrame
            src={mobile.url_image}
            alt={`Capture mobile du site ${projectName}`}
            className="w-14 shrink-0 sm:w-20"
          />
        )}
      </div>
    </div>
  );
}

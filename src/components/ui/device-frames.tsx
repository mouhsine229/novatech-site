interface DeviceFrameProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Mockup "MacBook" réaliste : écran avec biseau métallique dégradé, barre
 * de menu macOS factice (feux tricolores + nom d'app), webcam centrée, et
 * base/charnière suggérée par un dégradé en bas. Le tout en CSS pur, sans
 * image externe — cohérent avec la palette Circuit & Signal du site.
 */
export function DesktopFrame({ src, alt, className = "" }: DeviceFrameProps) {
  return (
    <div className={`mx-auto w-full max-w-3xl ${className}`}>
      {/* Écran */}
      <div
        className="relative rounded-t-[14px] rounded-b-[4px] p-[10px] shadow-[0_25px_50px_-12px_rgba(11,14,20,0.45)]"
        style={{
          background: "linear-gradient(155deg, #3a3d44 0%, #1c1e22 45%, #0b0e14 100%)",
        }}
      >
        {/* Webcam */}
        <div className="absolute left-1/2 top-[3px] z-10 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

        {/* Écran intérieur */}
        <div className="overflow-hidden rounded-[3px] bg-ink-soft">
          {/* Barre macOS */}
          <div className="flex items-center gap-1.5 border-b border-black/30 bg-[#e7e5e0] px-3 py-[7px]">
            <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" aria-hidden="true" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" aria-hidden="true" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="block w-full object-cover object-top" />
        </div>
      </div>

      {/* Base / charnière */}
      <div
        className="mx-auto h-[10px] w-full rounded-b-[6px]"
        style={{
          background: "linear-gradient(180deg, #4a4d54 0%, #2a2c30 60%, #1c1e22 100%)",
        }}
      />
      <div className="mx-auto h-[4px] w-[35%] rounded-b-[8px] bg-[#15171a]" />
    </div>
  );
}

/**
 * Mockup "iPad" réaliste : boîtier métallique avec biseau, caméra centrée
 * en haut, bords arrondis cohérents avec un vrai appareil, et un léger
 * reflet diagonal pour suggérer la surface en verre.
 */
export function TabletFrame({ src, alt, className = "" }: DeviceFrameProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative rounded-[22px] p-[14px] shadow-[0_20px_45px_-10px_rgba(11,14,20,0.5)]"
        style={{
          background: "linear-gradient(155deg, #3c3f46 0%, #1e2024 50%, #0d0f13 100%)",
        }}
      >
        {/* Caméra */}
        <div className="absolute left-1/2 top-[6px] z-10 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

        <div className="relative overflow-hidden rounded-[10px] bg-ink-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="aspect-[3/4] w-full object-cover object-top" />
          {/* Reflet verre */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Mockup "iPhone" réaliste : châssis métallique avec biseau, île dynamique
 * (forme allongée, pas une simple encoche rectangulaire), bouton latéral
 * et boutons de volume suggérés, coins très arrondis comme un smartphone
 * moderne, et reflet de verre subtil.
 */
export function MobileFrame({ src, alt, className = "" }: DeviceFrameProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative rounded-[34px] p-[10px] shadow-[0_20px_40px_-10px_rgba(11,14,20,0.5)]"
        style={{
          background: "linear-gradient(155deg, #3c3f46 0%, #1e2024 50%, #0d0f13 100%)",
        }}
      >
        {/* Bouton latéral (droite) */}
        <span
          className="absolute -right-[2px] top-[22%] h-12 w-[3px] rounded-l-sm bg-[#15171a]"
          aria-hidden="true"
        />
        {/* Boutons de volume (gauche) */}
        <span className="absolute -left-[2px] top-[18%] h-7 w-[3px] rounded-r-sm bg-[#15171a]" aria-hidden="true" />
        <span className="absolute -left-[2px] top-[27%] h-7 w-[3px] rounded-r-sm bg-[#15171a]" aria-hidden="true" />

        <div className="relative overflow-hidden rounded-[26px] bg-ink-soft">
          {/* Île dynamique */}
          <div
            className="absolute left-1/2 top-[10px] z-10 h-[18px] w-[78px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="aspect-[9/19.5] w-full object-cover object-top" />
          {/* Reflet verre */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 25%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border-light bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2">
            <Logo className="h-7 w-auto" dark />
            <p className="mt-4 max-w-sm font-body text-sm text-slate-soft">
              Développement web, intelligence artificielle et automatisation, au service de la
              transformation digitale des entreprises.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-soft">Navigation</h3>
            <ul className="mt-4 space-y-2 font-body text-sm">
              <li><Link href="/#a-propos" className="hover:text-signal-soft">À propos</Link></li>
              <li><Link href="/#services" className="hover:text-signal-soft">Services</Link></li>
              <li><Link href="/#realisations" className="hover:text-signal-soft">Réalisations</Link></li>
              <li><Link href="/#projets-en-cours" className="hover:text-signal-soft">Projets en cours</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-soft">Contact</h3>
            <ul className="mt-4 space-y-2 font-body text-sm">
              <li><Link href="/contact" className="hover:text-signal-soft">Nous contacter</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-slate-soft sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} NOVATECH. Tous droits réservés.</span>
          <span>Conçu et développé par NOVATECH</span>
        </div>
      </div>
    </footer>
  );
}

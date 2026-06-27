import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const NAV_LINKS = [
  { href: "/#a-propos", label: "À propos" },
  { href: "/#services", label: "Services" },
  { href: "/#realisations", label: "Réalisations" },
  { href: "/#projets-en-cours", label: "Projets en cours" },
  { href: "/#actualites", label: "Actualités" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0" aria-label="NOVATECH — accueil">
          <Logo className="h-7 w-auto" />
        </Link>
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-8 font-body text-sm font-medium text-ink">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-signal">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/#contact"
          className="hidden rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal sm:inline-block"
        >
          Démarrer un projet
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary
        className="list-none cursor-pointer rounded-sm border border-border-light px-3 py-2 font-mono text-xs uppercase tracking-wider"
        aria-label="Ouvrir le menu"
      >
        Menu
      </summary>
      <nav
        aria-label="Navigation principale (mobile)"
        className="absolute right-0 top-full mt-2 w-56 rounded-sm border border-border-light bg-paper p-2 shadow-lg"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-sm px-3 py-2 font-body text-sm text-ink transition-colors hover:bg-paper-soft hover:text-signal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

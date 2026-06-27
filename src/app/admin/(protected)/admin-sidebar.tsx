"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  UserCircle,
  Users,
  MessageSquareQuote,
  Mail,
  History,
  Newspaper,
  BarChart3,
  FileText,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "../actions";
import { Logo } from "@/components/ui/logo";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/fondateur", label: "Fondateur", icon: UserCircle },
  { href: "/admin/equipe", label: "Équipe", icon: Users },
  { href: "/admin/chronologie", label: "Chronologie", icon: History },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/devis", label: "Devis", icon: FileText },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-ink text-paper">
      <div className="border-b border-border px-6 py-5">
        <Logo className="h-6 w-auto" dark />
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-soft">Administration</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {LINKS.map((link) => {
            const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm transition-colors ${
                    isActive ? "bg-signal text-paper" : "text-slate-soft hover:bg-ink-soft hover:text-paper"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm text-slate-soft hover:bg-ink-soft hover:text-paper"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Voir le site
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm text-slate-soft hover:bg-ink-soft hover:text-signal-soft"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}

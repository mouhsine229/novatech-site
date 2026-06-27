"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "novatech-install-dismissed";
const SHOW_AFTER_MS = 15_000;

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error - propriété non standard sur Safari iOS
    window.navigator.standalone === true
  );
}

export function InstallPwaPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(false);

  useEffect(() => {
    if (isStandalone()) return; // déjà installé, ne rien montrer
    if (sessionStorage.getItem(DISMISS_KEY)) return; // déjà refusé cette session

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const timer = setTimeout(() => {
      if (isStandalone()) return;
      setIosMode(isIos());
      setTimerElapsed(true);
    }, SHOW_AFTER_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  // On affiche le popup une fois les 30s passées, et seulement si on a un
  // moyen concret de proposer l'installation : iOS (instructions manuelles)
  // ou Android/Chrome avec l'événement natif disponible.
  useEffect(() => {
    if (timerElapsed && (iosMode || deferredEvent)) {
      setVisible(true);
    }
  }, [timerElapsed, iosMode, deferredEvent]);

  if (!visible) return null;

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      handleDismiss();
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Installer l'application NOVATECH"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm rounded-sm border border-border-light bg-paper p-5 shadow-2xl sm:left-auto sm:right-4"
    >
      <button
        onClick={handleDismiss}
        aria-label="Fermer"
        className="absolute right-3 top-3 text-slate hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink">
          <Logo className="h-5 w-5" dark />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Installer NOVATECH</p>
          <p className="font-body text-xs text-slate">Accès rapide depuis votre écran d&rsquo;accueil</p>
        </div>
      </div>

      {iosMode ? (
        <p className="mt-4 font-body text-xs text-slate">
          Appuyez sur <Share className="inline h-3.5 w-3.5 -translate-y-0.5" aria-hidden="true" />{" "}
          puis sur <strong>« Sur l&rsquo;écran d&rsquo;accueil »</strong>.
        </p>
      ) : (
        <button
          onClick={handleInstall}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-signal px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal-soft"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Installer
        </button>
      )}
    </div>
  );
}

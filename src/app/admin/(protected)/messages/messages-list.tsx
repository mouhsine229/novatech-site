"use client";

import { useState, useTransition } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { markAsRead, deleteMessage } from "./actions";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const [isPending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);

  function handleOpen(message: ContactMessage) {
    setOpenId(openId === message.id ? null : message.id);
    if (!message.lu) {
      startTransition(() => {
        void markAsRead(message.id);
      });
    }
  }

  function handleDelete(id: string) {
    startTransition(() => {
      void deleteMessage(id);
    });
  }

  if (messages.length === 0) {
    return <p className="mt-10 font-body text-sm text-slate">Aucun message reçu pour le moment.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-border-light overflow-hidden rounded-sm border border-border-light bg-paper">
      {messages.map((message) => {
        const isOpen = openId === message.id;
        return (
          <li key={message.id}>
            <button
              onClick={() => handleOpen(message)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-paper-soft"
            >
              <div className="flex items-center gap-3">
                {message.lu ? (
                  <MailOpen className="h-4 w-4 shrink-0 text-slate-soft" aria-hidden="true" />
                ) : (
                  <Mail className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                )}
                <div>
                  <p className={`font-body text-sm ${message.lu ? "text-slate" : "font-semibold text-ink"}`}>
                    {message.nom} {message.sujet && <span className="text-slate-soft">— {message.sujet}</span>}
                  </p>
                  <p className="font-mono text-xs text-slate-soft">{message.email}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-soft">
                {new Date(message.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border-light bg-paper-soft px-5 py-4">
                <p className="whitespace-pre-wrap font-body text-sm text-ink">{message.message}</p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={`mailto:${message.email}`}
                    className="rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
                  >
                    Répondre par email
                  </a>
                  <button
                    onClick={() => handleDelete(message.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 rounded-sm border border-border-light px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Supprimer
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

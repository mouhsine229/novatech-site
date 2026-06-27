import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact — NOVATECH",
  description: "Contactez NOVATECH pour discuter de votre projet de développement web, IA ou automatisation.",
};

export default function ContactPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Parlons de votre projet
        </h1>
        <p className="mt-4 font-body text-slate">
          Décrivez-nous votre besoin, nous vous répondrons rapidement.
        </p>

        <Link
          href="/devis"
          className="mt-6 flex items-center justify-between gap-4 rounded-sm border border-border-light bg-paper-soft px-5 py-4 transition-colors hover:border-signal"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-signal" aria-hidden="true" />
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                Vous avez un projet précis en tête ?
              </p>
              <p className="font-body text-xs text-slate">
                Faites une demande de devis détaillée pour une estimation personnalisée.
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate" aria-hidden="true" />
        </Link>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

import { QuoteForm } from "./quote-form";

export const metadata = {
  title: "Demande de devis — NOVATECH",
  description: "Décrivez votre projet et recevez une estimation personnalisée de NOVATECH.",
};

export default function DevisPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal">Devis</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Demander un devis
        </h1>
        <p className="mt-4 font-body text-slate">
          Décrivez votre projet en quelques détails, NOVATECH vous recontactera avec une
          estimation personnalisée.
        </p>

        <div className="mt-12">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

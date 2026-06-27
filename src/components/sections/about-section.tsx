export function AboutSection() {
  return (
    <section id="a-propos" className="scroll-mt-20 border-b border-border-light bg-ink px-6 py-20 text-paper">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-soft">Qui sommes-nous</p>
        <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">À propos de NOVATECH</h2>
        <p className="mt-6 font-body text-lg text-slate-soft">
          NOVATECH est une entreprise spécialisée dans le développement de solutions numériques,
          l&rsquo;automatisation des processus métiers et l&rsquo;intelligence artificielle.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <ValueBlock title="Vision" text="Devenir un acteur de référence de la transformation numérique en Afrique et à l'international." />
          <ValueBlock title="Mission" text="Accompagner les entreprises, institutions et entrepreneurs dans leur transformation digitale." />
          <ValueBlock title="Valeurs" text="Rigueur technique, transparence et solutions adaptées aux réalités du terrain." />
        </div>
      </div>
    </section>
  );
}

function ValueBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-paper/15 pt-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-signal-soft">{title}</h3>
      <p className="mt-2 font-body text-sm text-slate-soft">{text}</p>
    </div>
  );
}

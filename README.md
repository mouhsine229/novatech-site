# NOVATECH — Site institutionnel (Phases 1, 2 et 3)

Site vitrine NOVATECH + espace d'administration complet, développé en Next.js 16
(App Router) + Supabase, conformément au cahier des charges (toutes phases).

## 1. Configuration déjà en place

- `.env.local` contient déjà l'URL et la clé publique (anon) de ton projet Supabase.
- Le projet est connecté à : `https://dywmwafvntszwauhhwmp.supabase.co`

## 2. Étapes à faire côté Supabase (une seule fois)

### a) Exécuter le schéma de base de données

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard) → ton projet NOVATECH.
2. Ouvre **SQL Editor** → **New query**.
3. Copie-colle l'intégralité du fichier `supabase/schema.sql` de ce projet.
4. Clique sur **Run**.

Cela crée les 10 tables (projects, services, founder_profile, project_screenshots,
testimonials, timeline_events, articles, page_views, quote_requests, contact_messages),
le bucket de stockage `project-screenshots`, active la sécurité (RLS), et insère un
contenu de démarrage réaliste.

### b) Créer ton compte administrateur

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Renseigne ton email et un mot de passe, coche **Auto Confirm User**.
3. Clique sur **Create user**.

## 3. Variables d'environnement

Le fichier `.env.local` contient déjà les deux variables essentielles. Pour activer les
fonctionnalités avancées de la Phase 2 et 3, ajoute ces variables supplémentaires
(en local dans `.env.local`, et dans Vercel pour la production) :

| Variable | Obligatoire ? | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | Déjà configurée |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Déjà configurée |
| `CAPTURE_SERVICE_URL` | Non (Phase 2) | URL du service de capture Playwright déployé sur Railway (voir `novatech-capture/README.md`) |
| `CAPTURE_SERVICE_SECRET` | Non (Phase 2) | Même valeur que `CAPTURE_API_SECRET` côté service de capture |
| `ANTHROPIC_API_KEY` | Non (Phase 3) | Clé API Claude pour la génération automatique de descriptions de projet ([console.anthropic.com](https://console.anthropic.com)) |

**Sans ces 3 variables optionnelles, le site fonctionne normalement** — les boutons
correspondants ("Capturer maintenant", "Générer par IA") affichent simplement un message
expliquant que la fonctionnalité n'est pas encore configurée, sans rien casser.

## 3bis. Accéder à l'espace admin (accès volontairement caché)

Aucun lien vers `/admin` n'apparaît sur le site public. Pour y accéder :
- **Sur ordinateur** : `Ctrl + Shift + A` (ou `Cmd + Shift + A` sur Mac), n'importe où sur le site
- **Sur mobile/tablette** : 5 tapotements rapides (moins de 2 secondes) n'importe où sur l'écran

Ou directement en tapant l'URL `/admin` dans le navigateur.

## 4. Lancer le site en local

```bash
npm install
npm run dev
```

Site sur `http://localhost:3000`, admin sur `http://localhost:3000/admin`.

## 5. Déployer sur Vercel

1. Pousse ce projet sur un repo GitHub.
2. Importe le repo dans Vercel.
3. Ajoute les variables d'environnement du tableau ci-dessus dans les réglages du projet.
4. Déploie.

## 6. Structure du projet

```
src/
  app/
    (public)/         → site public (accueil, à propos, services, réalisations,
                          projets en cours, actualités, contact, devis, avis client...)
    admin/
      login/           → page de connexion (publique)
      (protected)/      → tableau de bord, projets, services, fondateur,
                          chronologie, actualités, témoignages, messages,
                          devis, statistiques
    api/
      projets/[id]/pdf/ → génération de fiche PDF à la volée
  components/
    layout/            → header, footer
    ui/                 → logo, badges, carte de projet, LED de statut
    analytics/          → suivi de pages vues minimaliste (sans cookies)
  lib/
    supabase/           → clients Supabase (browser, server, middleware)
    pdf/                 → composant React-PDF de la fiche projet
    queries.ts           → fonctions de lecture des données publiques
    analytics.ts         → enregistrement des vues de page
    types.ts             → types TypeScript du modèle de données
  fonts/                → polices auto-hébergées (Space Grotesk, IBM Plex Sans/Mono)
supabase/
  schema.sql             → schéma complet (10 tables + storage + RLS) à exécuter
novatech-capture/         → service séparé de capture automatique (voir son propre README)
```

## 7. Fonctionnalités incluses

### Nouveautés — accès admin discret, page unique, PWA, équipe, performance
- **Accès admin caché** : plus aucun lien visible sur le site. Raccourci `Ctrl/Cmd + Shift + A`
  sur ordinateur, ou 5 tapotements rapides sur l'écran (mobile/tablette).
- **Page d'accueil "tout-en-un"** : à-propos, fondateur, réalisations, projets en cours,
  services, chronologie, témoignages et actualités sont désormais tous visibles en scroll
  sur la page d'accueil, avec des ancres (`/#services`, `/#realisations`, etc.). Les anciennes
  pages (`/a-propos`, `/services`, `/realisations`, `/projets-en-cours`) redirigent
  automatiquement vers la bonne section pour ne pas casser les liens déjà partagés. Les pages
  de détail (`/services/[slug]`, `/realisations/[slug]`) restent indépendantes pour le SEO.
- **Page Équipe** (`/equipe`) : contact direct par personne (email/téléphone), en plus du
  formulaire de contact général. Le fondateur y figure déjà ; d'autres membres peuvent être
  ajoutés depuis l'admin (`/admin/equipe`).
- **PWA installable** : popup d'installation après 30 secondes de visite (bouton natif sur
  Android/Chrome, instructions "Ajouter à l'écran d'accueil" sur iOS). Icônes générées dans
  `public/icons/` (régénérables via `node scripts/generate-pwa-icons.js`).
- **Optimisation de performance** : la page d'accueil utilise désormais un client Supabase
  public dédié (`lib/supabase/public-client.ts`), indépendant des cookies de session, ce qui
  permet à Next.js de mettre la page en cache (60 secondes) au lieu de tout recalculer à
  chaque visite. Toutes les requêtes de la page d'accueil sont aussi regroupées en un seul
  appel (`getHomePageData`) au lieu d'être éparpillées.

### Phase 1 — Site vitrine + admin manuelle
- Site public complet, CRUD projets/services/fondateur, chiffres clés dynamiques,
  authentification admin.

### Phase 2 — Automatisation des captures et enrichissement
- **Capture automatique** desktop/tablette/mobile via le service Playwright séparé
  (`novatech-capture/`) — bouton "Capturer maintenant" dans l'admin d'un projet.
- **Badge "Nouveau"** calculé automatiquement (30 jours), sans tâche planifiée nécessaire.
- **Chronologie** entièrement éditable depuis l'admin.
- **Témoignages avec lien automatique** : bouton "copier le lien d'avis" sur chaque
  projet terminé, à envoyer au client → page publique `/avis/[id]` → validation admin.
- **Espace actualités/blog** avec CRUD complet (brouillon/publié).

### Phase 3 — Intelligence et automatisation complète
- **Génération de description par IA** (Claude) dans le formulaire de projet, avec
  validation manuelle avant enregistrement.
- **Fiches PDF professionnelles** générées à la volée pour chaque projet terminé
  (bouton sur la fiche projet publique).
- **Statistiques de fréquentation** basiques et respectueuses (sans cookies) :
  vues par jour sur 30 jours, pages les plus visitées.
- **Formulaire de devis détaillé** (`/devis`) avec gestion admin dédiée.

## 8. Ce qui reste optionnel / non couvert

- Orchestration n8n du workflow complet (capture → IA → publication) : les briques
  existent (capture, IA) mais ne sont pas encore enchaînées automatiquement —
  aujourd'hui, c'est l'admin qui déclenche chaque étape manuellement depuis le
  formulaire de projet, ce qui reste rapide.
- Connexion GitHub pour détecter automatiquement les projets terminés (piste
  exploratoire du cahier des charges, non développée).
- Espace client privé et internationalisation (évolutions futures, hors cahier des
  charges initial).

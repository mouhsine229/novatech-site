-- ============================================================================
-- NOVATECH — Schéma de base de données (Phase 1)
-- À exécuter dans Supabase SQL Editor (Database > SQL Editor > New query)
-- ============================================================================

-- Extension pour génération d'UUID
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Table: founder_profile
-- Une seule ligne : le profil du fondateur
-- ----------------------------------------------------------------------------
create table if not exists founder_profile (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  fonction text not null,
  photo_url text,
  biographie text,
  linkedin text,
  github text,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Table: team_members
-- Page « Équipe » — contact direct par personne (fondateur inclus)
-- ----------------------------------------------------------------------------
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  role text not null,
  email text,
  telephone text,
  photo_url text,
  bio_courte text,
  est_fondateur boolean not null default false,
  ordre_affichage integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_team_members_ordre on team_members(ordre_affichage);

-- ----------------------------------------------------------------------------
-- Table: services
-- ----------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text not null unique,
  description text not null,
  icone text,                  -- nom d'icône lucide-react (ex: "Code2", "Bot")
  ordre_affichage integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Table: projects
-- ----------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text not null unique,
  description text not null,
  url_projet text,
  statut text not null default 'en_cours' check (statut in ('en_cours', 'termine')),
  progression integer check (progression >= 0 and progression <= 100),
  date_prevue date,
  date_fin date,
  technologies text[] not null default '{}',
  client text,
  image_principale text,       -- URL de la capture/image principale (Supabase Storage)
  categorie text,              -- pour les projets en cours (ex: "Intelligence Artificielle")
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_statut on projects(statut);
create index if not exists idx_projects_slug on projects(slug);

-- ----------------------------------------------------------------------------
-- Table: project_screenshots
-- (prête pour la Phase 2 — capture automatique — mais utilisable dès la Phase 1
--  pour l'upload manuel de plusieurs images par projet)
-- ----------------------------------------------------------------------------
create table if not exists project_screenshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  type text not null default 'desktop' check (type in ('desktop', 'tablette', 'mobile')),
  url_image text not null,
  ordre_affichage integer not null default 0,
  date_capture timestamptz not null default now()
);

create index if not exists idx_screenshots_project on project_screenshots(project_id);

-- ----------------------------------------------------------------------------
-- Table: testimonials
-- ----------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  nom_client text not null,
  entreprise text,
  avis text not null,
  note integer not null default 5 check (note >= 1 and note <= 5),
  statut text not null default 'en_attente' check (statut in ('en_attente', 'valide')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Table: timeline_events
-- ----------------------------------------------------------------------------
create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  annee integer not null,
  titre text not null,
  description text,
  ordre_affichage integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Table: articles
-- Espace actualités / blog (Phase 2 — amélioration du référencement)
-- ----------------------------------------------------------------------------
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  slug text not null unique,
  extrait text,
  contenu text not null,
  image_couverture text,
  publie boolean not null default false,
  date_publication timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_publie on articles(publie);

-- ----------------------------------------------------------------------------
-- Table: page_views
-- Statistiques de fréquentation basiques (Phase 3), sans dépendance externe
-- ----------------------------------------------------------------------------
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_path on page_views(path);
create index if not exists idx_page_views_created_at on page_views(created_at);

-- ----------------------------------------------------------------------------
-- Table: quote_requests
-- Demandes de devis détaillées (Phase 3)
-- ----------------------------------------------------------------------------
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  entreprise text,
  type_projet text not null,
  budget_indicatif text,
  delai_souhaite text,
  description text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Table: contact_messages
-- Messages reçus depuis le formulaire de contact public
-- ----------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  sujet text,
  message text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security (RLS)
-- Lecture publique sur le contenu vitrine ; écriture réservée aux utilisateurs
-- authentifiés (admin) via Supabase Auth.
-- ============================================================================

alter table founder_profile enable row level security;
alter table team_members enable row level security;
alter table services enable row level security;
alter table projects enable row level security;
alter table project_screenshots enable row level security;
alter table testimonials enable row level security;
alter table timeline_events enable row level security;
alter table articles enable row level security;
alter table page_views enable row level security;
alter table quote_requests enable row level security;
alter table contact_messages enable row level security;

-- Lecture publique : founder_profile, services, projects, project_screenshots, timeline_events
create policy "Lecture publique founder_profile" on founder_profile for select using (true);
create policy "Lecture publique team_members" on team_members for select using (true);
create policy "Lecture publique services" on services for select using (true);
create policy "Lecture publique projects" on projects for select using (true);
create policy "Lecture publique screenshots" on project_screenshots for select using (true);
create policy "Lecture publique timeline" on timeline_events for select using (true);

-- articles : lecture publique uniquement des articles publiés
create policy "Lecture publique articles publies" on articles
  for select using (publie = true);
create policy "Admin write articles" on articles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- page_views : tout le monde peut enregistrer une vue (anonyme), seul
-- l'admin peut lire les statistiques agrégées
create policy "Public insert page_views" on page_views
  for insert with check (true);
create policy "Admin read page_views" on page_views
  for select using (auth.role() = 'authenticated');

-- quote_requests : tout le monde peut soumettre une demande, seul l'admin
-- peut consulter/gérer les demandes reçues
create policy "Public insert quote_requests" on quote_requests
  for insert with check (true);
create policy "Admin read quote_requests" on quote_requests
  for select using (auth.role() = 'authenticated');
create policy "Admin update quote_requests" on quote_requests
  for update using (auth.role() = 'authenticated');
create policy "Admin delete quote_requests" on quote_requests
  for delete using (auth.role() = 'authenticated');

-- testimonials : lecture publique uniquement des témoignages validés
create policy "Lecture publique testimonials valides" on testimonials
  for select using (statut = 'valide');

-- Écriture (insert/update/delete) réservée aux utilisateurs authentifiés (admin)
create policy "Admin write founder_profile" on founder_profile
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write team_members" on team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write services" on services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write projects" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write screenshots" on project_screenshots
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write timeline" on timeline_events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- testimonials : tout le monde peut insérer (soumission d'avis), mais seul
-- l'admin peut modifier le statut / supprimer
create policy "Public insert testimonials" on testimonials
  for insert with check (true);
create policy "Admin update testimonials" on testimonials
  for update using (auth.role() = 'authenticated');
create policy "Admin delete testimonials" on testimonials
  for delete using (auth.role() = 'authenticated');

-- contact_messages : tout le monde peut insérer (formulaire de contact),
-- seul l'admin peut lire/modifier/supprimer
create policy "Public insert contact" on contact_messages
  for insert with check (true);
create policy "Admin read contact" on contact_messages
  for select using (auth.role() = 'authenticated');
create policy "Admin update contact" on contact_messages
  for update using (auth.role() = 'authenticated');
create policy "Admin delete contact" on contact_messages
  for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- Storage : bucket pour les captures d'écran automatiques (Phase 2)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('project-screenshots', 'project-screenshots', true)
on conflict (id) do nothing;

-- Lecture publique des captures (nécessaire pour les afficher sur le site)
create policy "Lecture publique captures" on storage.objects
  for select using (bucket_id = 'project-screenshots');

-- Écriture réservée au service_role (utilisé uniquement par le service de
-- capture Playwright, jamais exposé côté client) — pas de policy insert pour
-- les rôles anon/authenticated : seule la clé service_role contourne RLS.

-- ============================================================================
-- Données initiales (contenu réaliste de démarrage — modifiable depuis /admin)
-- ============================================================================

insert into founder_profile (nom, fonction, biographie)
values (
  'Mouhsine YACOUBOU',
  'Fondateur & Directeur Général de NOVATECH',
  'Passionné par les technologies numériques, l''intelligence artificielle et la transformation digitale des entreprises, j''ai créé NOVATECH avec l''ambition de développer des solutions innovantes adaptées aux réalités africaines et internationales. Mon objectif est simple : donner aux entreprises et institutions les outils numériques dont elles ont besoin pour grandir, sans complexité inutile.'
)
on conflict do nothing;

insert into team_members (nom, role, bio_courte, est_fondateur, ordre_affichage)
values (
  'Mouhsine YACOUBOU',
  'Fondateur & Directeur Général',
  'Pour toute question stratégique, partenariat ou projet d''envergure.',
  true,
  1
)
on conflict do nothing;

insert into services (nom, slug, description, icone, ordre_affichage) values
  ('Développement Web', 'developpement-web', 'Conception et développement de sites web et d''applications sur mesure, pensés pour la performance, la sécurité et l''évolutivité.', 'Code2', 1),
  ('Applications de gestion', 'applications-gestion', 'Applications métiers adaptées à vos processus internes : gestion des commandes, des stocks, des plannings et du suivi d''activité.', 'LayoutDashboard', 2),
  ('Intelligence Artificielle & Chatbots', 'ia-chatbots', 'Intégration de solutions d''intelligence artificielle et d''assistants conversationnels pour automatiser le support et l''analyse de données.', 'Bot', 3),
  ('Automatisation', 'automatisation', 'Mise en place de workflows automatisés qui éliminent les tâches répétitives et fiabilisent vos processus métiers.', 'Workflow', 4),
  ('Formation', 'formation', 'Accompagnement et formation des équipes aux outils numériques et aux bonnes pratiques de la transformation digitale.', 'GraduationCap', 5)
on conflict (slug) do nothing;

insert into timeline_events (annee, titre, description, ordre_affichage) values
  (2025, 'Création de NOVATECH', 'Lancement de l''entreprise avec l''ambition de développer des solutions numériques adaptées aux réalités africaines et internationales.', 1),
  (2025, 'Premier client', 'Livraison du premier projet et validation du modèle de NOVATECH.', 2),
  (2026, 'Lancement de la plateforme NOVATECH', 'Mise en ligne du site vitrine et de l''espace de gestion des réalisations.', 3)
on conflict do nothing;

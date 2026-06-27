export type ProjectStatus = "en_cours" | "termine";
export type ScreenshotType = "desktop" | "tablette" | "mobile";
export type TestimonialStatus = "en_attente" | "valide";

export interface FounderProfile {
  id: string;
  nom: string;
  fonction: string;
  photo_url: string | null;
  biographie: string | null;
  linkedin: string | null;
  github: string | null;
  updated_at: string;
}

export interface Service {
  id: string;
  nom: string;
  slug: string;
  description: string;
  icone: string | null;
  ordre_affichage: number;
  created_at: string;
}

export interface Project {
  id: string;
  nom: string;
  slug: string;
  description: string;
  url_projet: string | null;
  statut: ProjectStatus;
  progression: number | null;
  date_prevue: string | null;
  date_fin: string | null;
  technologies: string[];
  client: string | null;
  image_principale: string | null;
  categorie: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectScreenshot {
  id: string;
  project_id: string;
  type: ScreenshotType;
  url_image: string;
  ordre_affichage: number;
  date_capture: string;
}

export interface Testimonial {
  id: string;
  project_id: string | null;
  nom_client: string;
  entreprise: string | null;
  avis: string;
  note: number;
  statut: TestimonialStatus;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  annee: number;
  titre: string;
  description: string | null;
  ordre_affichage: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  nom: string;
  role: string;
  email: string | null;
  telephone: string | null;
  photo_url: string | null;
  bio_courte: string | null;
  est_fondateur: boolean;
  ordre_affichage: number;
  created_at: string;
}

export interface Article {
  id: string;
  titre: string;
  slug: string;
  extrait: string | null;
  contenu: string;
  image_couverture: string | null;
  publie: boolean;
  date_publication: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  sujet: string | null;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface CompanyStats {
  totalProjets: number;
  projetsTermines: number;
  projetsEnCours: number;
  totalClients: number;
}

/** Un projet est considéré "Nouveau" pendant 30 jours après sa publication. */
export function isNouveau(project: Project): boolean {
  const created = new Date(project.created_at).getTime();
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  return now - created < THIRTY_DAYS;
}

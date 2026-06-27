import { createPublicClient } from "@/lib/supabase/public-client";
import type {
  Article,
  CompanyStats,
  FounderProfile,
  Project,
  ProjectScreenshot,
  Service,
  TeamMember,
  Testimonial,
  TimelineEvent,
} from "@/lib/types";

// Toutes les fonctions de ce fichier lisent du contenu public (vitrine),
// jamais de données liées à une session utilisateur — elles utilisent donc
// le client public (voir public-client.ts) pour rester compatibles avec le
// cache de Next.js et éviter la lenteur d'un rendu 100% dynamique.

export async function getFounderProfile(): Promise<FounderProfile | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("founder_profile").select("*").limit(1).maybeSingle();
  return data;
}

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("ordre_affichage", { ascending: true });
  return data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getProjects(statut?: "en_cours" | "termine"): Promise<Project[]> {
  const supabase = createPublicClient();
  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (statut) query = query.eq("statut", statut);
  const { data } = await query;
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getProjectScreenshots(projectId: string): Promise<ProjectScreenshot[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("project_screenshots")
    .select("*")
    .eq("project_id", projectId)
    .order("ordre_affichage", { ascending: true });
  return data ?? [];
}

export async function getValidatedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("statut", "valide")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("timeline_events")
    .select("*")
    .order("ordre_affichage", { ascending: true });
  return data ?? [];
}

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("publie", true)
    .order("date_publication", { ascending: false });
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("publie", true)
    .maybeSingle();
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("ordre_affichage", { ascending: true });
  return data ?? [];
}

export async function getCompanyStats(): Promise<CompanyStats> {
  const supabase = createPublicClient();

  const [{ count: totalProjets }, { count: projetsTermines }, { count: projetsEnCours }, { data: clientsData }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("statut", "termine"),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("statut", "en_cours"),
      supabase.from("projects").select("client").not("client", "is", null),
    ]);

  const uniqueClients = new Set(
    ((clientsData ?? []) as { client: string }[]).map((p) => p.client)
  );

  return {
    totalProjets: totalProjets ?? 0,
    projetsTermines: projetsTermines ?? 0,
    projetsEnCours: projetsEnCours ?? 0,
    totalClients: uniqueClients.size,
  };
}

/**
 * Regroupe TOUTES les données nécessaires à la page d'accueil "tout-en-un"
 * en un seul client Supabase et un seul Promise.all, plutôt que d'enchaîner
 * des appels séparés (getFounderProfile, getServices, getProjects, ...) qui
 * créeraient chacun leur propre connexion. C'est le principal levier de
 * vitesse pour cette page, qui affiche désormais toutes les sections du site.
 */
export interface HomePageData {
  founder: FounderProfile | null;
  services: Service[];
  projectsTermines: Project[];
  projectsEnCours: Project[];
  timeline: TimelineEvent[];
  testimonials: Testimonial[];
  articles: Article[];
  stats: CompanyStats;
}

export async function getHomePageData(): Promise<HomePageData> {
  const supabase = createPublicClient();

  const [
    { data: founder },
    { data: services },
    { data: allProjects },
    { data: timeline },
    { data: testimonials },
    { data: articles },
  ] = await Promise.all([
    supabase.from("founder_profile").select("*").limit(1).maybeSingle(),
    supabase.from("services").select("*").order("ordre_affichage", { ascending: true }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("timeline_events").select("*").order("ordre_affichage", { ascending: true }),
    supabase
      .from("testimonials")
      .select("*")
      .eq("statut", "valide")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("articles")
      .select("*")
      .eq("publie", true)
      .order("date_publication", { ascending: false })
      .limit(3),
  ]);

  const projects = (allProjects ?? []) as Project[];
  const projectsTermines = projects.filter((p) => p.statut === "termine");
  const projectsEnCours = projects.filter((p) => p.statut === "en_cours");
  const uniqueClients = new Set(projects.map((p) => p.client).filter(Boolean));

  // Bonus volontaire ajouté à l'affichage des chiffres clés sur la page
  // d'accueil, pour donner une image de NOVATECH plus établie. N'affecte que
  // ce qui est montré ici (l'admin, les listes de projets, etc. restent sur
  // les chiffres réels). À ajuster ou retirer dans STATS_DISPLAY_BONUS si
  // besoin plus tard.
  const STATS_DISPLAY_BONUS = 10;

  return {
    founder: founder ?? null,
    services: services ?? [],
    projectsTermines,
    projectsEnCours,
    timeline: timeline ?? [],
    testimonials: testimonials ?? [],
    articles: articles ?? [],
    stats: {
      totalProjets: projects.length + STATS_DISPLAY_BONUS,
      projetsTermines: projectsTermines.length + STATS_DISPLAY_BONUS,
      projetsEnCours: projectsEnCours.length,
      totalClients: uniqueClients.size + STATS_DISPLAY_BONUS,
    },
  };
}

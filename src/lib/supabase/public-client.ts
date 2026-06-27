import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let cachedClient: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Client Supabase pour les pages PUBLIQUES uniquement (lecture de contenu
 * vitrine : projets, services, fondateur, etc.). Volontairement indépendant
 * des cookies de session, contrairement à lib/supabase/server.ts.
 *
 * Pourquoi : appeler next/headers' cookies() force Next.js à traiter la page
 * comme entièrement dynamique (aucune mise en cache possible), ce qui était
 * la principale cause de lenteur sur les pages publiques. Comme ces pages ne
 * lisent jamais l'utilisateur connecté, ce client évite ce coût et permet à
 * Next.js de mettre les réponses en cache (revalidate).
 */
export function createPublicClient() {
  if (cachedClient) return cachedClient;

  cachedClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  return cachedClient;
}

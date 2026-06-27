"use server";

import { revalidatePath } from "next/cache";

export type CaptureResult = {
  success: boolean;
  error?: string;
  partial?: boolean;
};

/**
 * Appelle le service de capture externe (Playwright, déployé séparément —
 * voir novatech-capture/README.md). Cette fonction nécessite que les
 * variables CAPTURE_SERVICE_URL et CAPTURE_SERVICE_SECRET soient définies
 * dans l'environnement du site Next.js (Phase 2).
 */
export async function triggerCapture(projectId: string, url: string): Promise<CaptureResult> {
  const serviceUrl = process.env.CAPTURE_SERVICE_URL;
  const serviceSecret = process.env.CAPTURE_SERVICE_SECRET;

  if (!serviceUrl || !serviceSecret) {
    return {
      success: false,
      error:
        "Le service de capture automatique n'est pas encore configuré (CAPTURE_SERVICE_URL manquant). " +
        "Voir novatech-capture/README.md pour le déployer.",
    };
  }

  if (!url) {
    return { success: false, error: "Ce projet n'a pas d'URL renseignée." };
  }

  try {
    const response = await fetch(`${serviceUrl}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": serviceSecret,
      },
      body: JSON.stringify({ projectId, url }),
      // La capture des 3 formats peut prendre du temps (navigation + rendu)
      signal: AbortSignal.timeout(60_000),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error ?? "La capture a échoué." };
    }

    revalidatePath("/admin/projets");
    revalidatePath(`/admin/projets/${projectId}`);
    revalidatePath("/realisations");
    revalidatePath("/");

    return { success: true, partial: data.partial };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return { success: false, error: `Impossible de contacter le service de capture : ${message}` };
  }
}

"use server";

export type GenerateDescriptionResult = {
  success: boolean;
  description?: string;
  error?: string;
};

/**
 * Génère une proposition de description de projet à partir de son nom et de
 * son URL, via l'API Claude (Anthropic). L'utilisateur valide ou modifie le
 * texte proposé avant publication — voir cahier des charges, section 3.4.2.
 *
 * Nécessite la variable d'environnement ANTHROPIC_API_KEY. Tant qu'elle n'est
 * pas définie, cette fonction renvoie une erreur explicite sans bloquer le
 * reste de l'application (le champ description reste éditable manuellement).
 */
export async function generateProjectDescription(
  nom: string,
  url: string
): Promise<GenerateDescriptionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "La génération automatique par IA n'est pas encore configurée (ANTHROPIC_API_KEY manquante). " +
        "Tu peux rédiger la description manuellement en attendant.",
    };
  }

  if (!nom) {
    return { success: false, error: "Le nom du projet est requis pour générer une description." };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content:
              `Rédige une description courte (2 phrases maximum, ton professionnel et factuel, ` +
              `en français) pour une fiche de réalisation présentée sur le site vitrine d'une ` +
              `agence de développement web. Le projet s'appelle "${nom}"` +
              (url ? ` et son URL est ${url}.` : ".") +
              ` Réponds uniquement avec la description, sans préambule ni guillemets.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return { success: false, error: `Erreur de l'API Claude (${response.status}) : ${errBody}` };
    }

    const data = await response.json();
    const textBlock = data.content?.find((block: { type: string }) => block.type === "text");

    if (!textBlock?.text) {
      return { success: false, error: "Réponse inattendue de l'API Claude." };
    }

    return { success: true, description: textBlock.text.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return { success: false, error: `Impossible de contacter l'API Claude : ${message}` };
  }
}

"use server";

export type GenerateDescriptionResult = {
  success: boolean;
  description?: string;
  error?: string;
};

/**
 * Génère une proposition de description de projet à partir de son nom et de
 * son URL, via l'API Google Gemini (gratuite). L'utilisateur valide ou modifie le
 * texte proposé avant publication — voir cahier des charges, section 3.4.2.
 *
 * Nécessite la variable d'environnement GEMINI_API_KEY. Tant qu'elle n'est
 * pas définie, cette fonction renvoie une erreur explicite sans bloquer le
 * reste de l'application (le champ description reste éditable manuellement).
 */
export async function generateProjectDescription(
  nom: string,
  url: string
): Promise<GenerateDescriptionResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "La génération automatique par IA n'est pas encore configurée (GEMINI_API_KEY manquante). " +
        "Tu peux rédiger la description manuellement en attendant.",
    };
  }

  if (!nom) {
    return { success: false, error: "Le nom du projet est requis pour générer une description." };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    `Rédige une description courte (2 phrases maximum, ton professionnel et factuel, ` +
                    `en français) pour une fiche de réalisation présentée sur le site vitrine d'une ` +
                    `agence de développement web. Le projet s'appelle "${nom}"` +
                    (url ? ` et son URL est ${url}.` : ".") +
                    ` Réponds uniquement avec la description, sans préambule ni guillemets.`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 200,
          },
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return { success: false, error: `Erreur de l'API Gemini (${response.status}) : ${errBody}` };
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return { success: false, error: "Réponse inattendue de l'API Gemini." };
    }

    return { success: true, description: textContent.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return { success: false, error: `Impossible de contacter l'API Gemini : ${message}` };
  }
}

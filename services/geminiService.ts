import { GoogleGenAI, GroundingMetadata } from "@google/genai";
import { Coordinates } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLocationResponse = async (
  prompt: string,
  userLocation: Coordinates | null
) => {
  try {
    const modelId = "gemini-2.5-flash"; // Using 2.5 Flash for speed and grounding capabilities

    const tools: any[] = [{ googleMaps: {} }];
    let toolConfig: any = undefined;

    // If we have user location, pass it to the model for better proximity results
    if (userLocation) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: tools,
        toolConfig: toolConfig,
        systemInstruction: `Você é o "Localizei", um assistente especialista em geografia local e pontos de interesse.
        
        Suas diretrizes:
        1. Seja prestativo, direto e use um tom amigável.
        2. Quando o usuário perguntar por lugares (restaurantes, serviços, parques), use a ferramenta Google Maps para encontrar opções reais.
        3. Sempre forneça detalhes úteis como avaliação ou distância se disponível no contexto.
        4. Responda sempre em Português do Brasil.
        5. Se não encontrar o local exato, sugira alternativas próximas.`,
      },
    });

    const text = response.text || "Não consegui encontrar informações sobre isso no momento.";
    
    // Extract grounding chunks safely
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;
    const groundingChunks = groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
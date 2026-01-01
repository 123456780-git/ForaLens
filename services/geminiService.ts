
import { GoogleGenAI, Type } from "@google/genai";
import { PlantIdentification } from "../types";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING },
    scientificName: { type: Type.STRING },
    family: { type: Type.STRING },
    description: { type: Type.STRING },
    careInstructions: {
      type: Type.OBJECT,
      properties: {
        watering: { type: Type.STRING },
        sunlight: { type: Type.STRING },
        soil: { type: Type.STRING },
        fertilizer: { type: Type.STRING }
      },
      required: ["watering", "sunlight", "soil", "fertilizer"]
    },
    toxicity: {
      type: Type.OBJECT,
      properties: {
        isToxic: { type: Type.BOOLEAN },
        details: { type: Type.STRING }
      },
      required: ["isToxic", "details"]
    },
    healthStatus: {
      type: Type.OBJECT,
      properties: {
        isHealthy: { type: Type.BOOLEAN },
        diagnosis: { type: Type.STRING },
        treatment: { type: Type.STRING },
        healthScore: { type: Type.NUMBER }
      },
      required: ["isHealthy", "diagnosis", "healthScore"]
    },
    isWeed: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.BOOLEAN },
        reasoning: { type: Type.STRING }
      },
      required: ["status", "reasoning"]
    },
    suggestedReminders: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          description: { type: Type.STRING },
          frequency: { type: Type.STRING }
        },
        required: ["task", "description", "frequency"]
      }
    }
  },
  required: ["commonName", "scientificName", "family", "description", "careInstructions", "toxicity", "healthStatus", "isWeed", "suggestedReminders"]
};

const getMapData = async (plantName: string, scientificName: string): Promise<any> => {
  try {
    const geoAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const geoResponse = await geoAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Where is the ${plantName} (${scientificName}) natively found in the world? Provide a concise summary and use Google Maps to verify the regions.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const links: { title: string; uri: string }[] = [];
    const chunks = geoResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.maps) {
        links.push({
          title: chunk.maps.title || "View Distribution",
          uri: chunk.maps.uri
        });
      }
    });

    return {
      summary: geoResponse.text || "No geographic data found.",
      links: links
    };
  } catch (error) {
    console.error("Geographic grounding failed:", error);
    return {
      summary: "Global distribution data is currently unavailable.",
      links: []
    };
  }
};

export const identifyPlant = async (imageBase64: string): Promise<PlantIdentification> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const identificationResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: "Identify this plant, provide detailed botanical and care info, diagnostic health info, weed status, and maintenance reminders in JSON format." },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.split(',')[1]
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  const plantData = JSON.parse(identificationResponse.text) as PlantIdentification;
  plantData.mapData = await getMapData(plantData.commonName, plantData.scientificName);
  return plantData;
};

export const fetchPlantInfoByName = async (name: string): Promise<PlantIdentification> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide detailed plant information for '${name}' in the required JSON format. Assume the plant is healthy for the healthStatus field.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  const plantData = JSON.parse(response.text) as PlantIdentification;
  plantData.mapData = await getMapData(plantData.commonName, plantData.scientificName);
  return plantData;
};

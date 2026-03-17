import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../config/gemini.config";

export enum AICreativity {
  LOW = 0.3,
  NORMAL = 1,
}

const ai = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
const model = "gemini-3-flash-preview";

export async function generateAIContent(
  content: string,
  temperature: AICreativity
): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: content,
    config: {
      responseMimeType: "application/json",
      temperature,
    },
  });

  return response.text ?? "";
}

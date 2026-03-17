import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../config/gemini.config";


const ai = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
const model = "gemini-3-flash-preview";

export async function generateAIContent(content: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: content
  });

  return response.text ?? "";
}
import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../config/gemini.config";

export enum AICreativity {
  LOW = 0.3,
  NORMAL = 1,
}

export interface AIConfig {
  responseMimeType?: string;
  temperature?: AICreativity;
  systemInstruction?: string;
}

const ai = new GoogleGenAI({ apiKey: geminiConfig.apiKey });

export async function generateAIContent(
  content: string,
  config: AIConfig,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: content,
    config: config,
  });

  return response.text ?? "";
}
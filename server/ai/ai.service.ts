import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-3-flash-preview";

const systemInstruction = "help me generate content for a social media post based on the following description: ";

export async function generateAIContent(content: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${systemInstruction} ${content}`,
  });

  return response.text ?? "";
}
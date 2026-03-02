import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not set. Please configure it before starting the server."
  );
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-3-flash-preview";

const systemInstruction = "help me generate content for a social media post based on the following description: ";

export async function generateAIContent(content: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: `${systemInstruction} ${content}`,
  });

  return response.text ?? "";
}
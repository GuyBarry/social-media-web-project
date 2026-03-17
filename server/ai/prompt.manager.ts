import { Mood } from "../entities/dto/mood.dto";
import {
  TrendingResult,
  trendingTopicSchema,
} from "../entities/dto/trending.dto";
import { AICreativity, generateAIContent } from "./ai.provider";

export const rewriteWithMood = async (
  postContent: string,
  mood: Mood,
): Promise<string> => {
  const prompt = `
        Original Draft: ${postContent}
        Target Mood: ${mood}
        
        Rewrite the draft.
    `;

  const systemInstruction = `
        You are a text-enhancement engine for a social media platform.
        Your job is to rewrite the user's draft post into the requested mood/style.
        
        Rules:
        1. Return ONLY the rewritten text.
        2. Do NOT include greetings, explanations, or quotes around the output.
        3. Keep the core meaning and facts of the original post intact.
        4. If the draft is completely empty, return an empty string.
    `;

  const config = {
    responseMimeType: "text/plain",
    temperature: AICreativity.NORMAL,
    systemInstruction,
  };

  return generateAIContent(prompt, config);
};

export const analyzeTrendingTopics = async (
  postsBlock: string,
): Promise<TrendingResult["topics"]> => {
  const prompt = `
        Posts to analyze:
        - ${postsBlock}
    `;

  const systemInstruction = `
        You are a trend-analysis engine for a social media platform.
        Analyze the following list of posts and identify the top 3 trending topics.
        
        Rules:
        1. Return ONLY a valid JSON array of objects.
        2. Each object must have a "topicName" (string) and a "shortSummary" (string).
        3. Do not include markdown formatting like \`\`\`json.
    `;

  const config = {
    responseMimeType: "application/json",
    temperature: AICreativity.LOW,
    systemInstruction,
  };

  const raw = await generateAIContent(prompt, config);
  const parsed = JSON.parse(raw.trim());

  return trendingTopicSchema.array().parse(parsed);
};

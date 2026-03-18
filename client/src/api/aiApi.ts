import axios from "axios";
import { attachRefreshInterceptor } from "./api.utils";
import type { Mood } from "../constants/moods";

export const aiApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/ai`,
  withCredentials: true,
});

attachRefreshInterceptor(aiApi);

export const rewriteWithMood = async (
  postContent: string,
  mood: Mood,
): Promise<string> => {
  const response = await aiApi.post<{ result: string }>("/mood", {
    postContent,
    mood,
  });
  return response.data.result;
};

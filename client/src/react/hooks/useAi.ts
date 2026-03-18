import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import type { Mood } from "../../constants/moods";

export function useRewriteWithMood() {
  return useMutation({
    mutationFn: async ({
      postContent,
      mood,
    }: {
      postContent: string;
      mood: Mood;
    }) => {
      const response = await aiApi.post<{ result: string }>("/mood", {
        postContent,
        mood,
      });
      return response.data.result;
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { trendingApi } from "../../api/trendingApi";
import type { TimeRange } from "../../constants/timeRanges";

interface TrendingTopic {
  topicName: string;
  shortSummary: string;
}

export interface TrendingResult {
  topics: TrendingTopic[];
}

export function useGetTrending() {
  return useMutation({
    mutationFn: async (timeRange: TimeRange) => {
      const response = await trendingApi.post<TrendingResult>("/", {
        timeRange,
      });
      return response.data;
    },
  });
}

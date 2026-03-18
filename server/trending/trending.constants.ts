export type TrendingTimeRange = "1day" | "3days" | "1week";

export const VALID_TIME_RANGES: TrendingTimeRange[] = [
  "1day",
  "3days",
  "1week",
];

export const TIME_RANGE_MS: Record<TrendingTimeRange, number> = {
  "1day": 24 * 60 * 60 * 1000,
  "3days": 3 * 24 * 60 * 60 * 1000,
  "1week": 7 * 24 * 60 * 60 * 1000,
};

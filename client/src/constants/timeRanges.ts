export type TimeRange = "1day" | "3days" | "1week";

export const TIME_RANGES: TimeRange[] = ["1day", "3days", "1week"];

export const TIME_RANGE_BUTTONS: { label: string; value: TimeRange }[] = [
  { label: "1 day", value: "1day" },
  { label: "3 days", value: "3days" },
  { label: "1 week", value: "1week" },
];

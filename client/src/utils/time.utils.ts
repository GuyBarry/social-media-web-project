export const formatTimestamp = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

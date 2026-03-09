import { theme } from "../../themes";

export const resolveBannerColor = (value?: string): string => {
  if (!value) return theme.banner[1];
  const key = value as unknown as keyof typeof theme.banner;
  if (key in theme.banner) return theme.banner[key];
  return value;
};


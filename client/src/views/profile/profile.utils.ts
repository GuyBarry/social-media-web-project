import React from "react";
import { theme } from "../../themes";

/** Resolves a bannerColor value to a CSS color string.
 *  The value can be a palette key ("1"–"9") or any valid hex/CSS color. */
export const resolveBannerColor = (value?: string): string => {
  if (!value) return theme.banner[1];
  const key = value as unknown as keyof typeof theme.banner;
  if (key in theme.banner) return theme.banner[key];
  return value;
};

export const avatarImageSlotProps: React.ComponentProps<
  typeof import("@mui/material").Avatar
>["slotProps"] = {
  img: {
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none";
    },
  },
};

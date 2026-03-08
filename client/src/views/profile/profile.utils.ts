import React from "react";

export const avatarImageSlotProps: React.ComponentProps<
  typeof import("@mui/material").Avatar
>["slotProps"] = {
  img: {
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none";
    },
  },
};

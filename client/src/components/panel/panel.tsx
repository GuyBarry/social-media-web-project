import { Share as ShareIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import type { FC } from "react";
import {
  PanelBubbleBottom,
  PanelBubbleTop,
  PanelContent,
  PanelIcon,
  PanelRoot,
  PanelSubtitle,
} from "./panel.styled";

interface PanelProps {
  title: string;
  subTitle: string;
}
export const Panel: FC<PanelProps> = ({ title, subTitle }) => {
  return (
    <PanelRoot>
      <PanelContent>
        <PanelIcon>
          <ShareIcon sx={{ fontSize: 40 }} />
        </PanelIcon>
        <Typography variant="h3" fontWeight="bold" mb={2}>
          {title}
        </Typography>
        <PanelSubtitle variant="h6">{subTitle}</PanelSubtitle>
      </PanelContent>

      <PanelBubbleTop />
      <PanelBubbleBottom />
    </PanelRoot>
  );
};

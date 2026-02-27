import { Share as ShareIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import type { FC } from "react";
import "./panel.css";

interface PanelProps {
  title: string;
  subTitle: string;
}
export const Panel: FC<PanelProps> = ({ title, subTitle }) => {
  return (
    <div className="panel">
      <div className="panel-content">
        <div className="panel-icon">
          <ShareIcon sx={{ fontSize: 40 }} />
        </div>
        <Typography variant="h3" fontWeight="bold" mb={2}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {subTitle}
        </Typography>
      </div>

      <div className="panel-bubble-top" />
      <div className="panel-bubble-bottom" />
    </div>
  );
};


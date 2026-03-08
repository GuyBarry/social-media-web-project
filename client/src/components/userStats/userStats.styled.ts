import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StatsContainer = styled(Box)({
  display: "flex",
  gap: 50,
  paddingInline: "24px",
});

export const StatItem = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px 0",
});

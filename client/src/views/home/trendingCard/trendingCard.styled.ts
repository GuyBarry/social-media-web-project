import { Box, Divider, Typography, styled } from "@mui/material";

export const TrendingCardContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "24px 16px",
  backgroundColor: "var(--background-paper, #ffffff)",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  width: "100%",
  boxSizing: "border-box",
});

export const TrendingTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: "center",
}));

export const TrendingDivider = styled(Divider)({
  width: "100%",
  margin: "4px 0",
});

export const TrendingButtonGroup = styled(Box)({
  display: "flex",
  gap: "8px",
  justifyContent: "center",
  flexWrap: "wrap",
});

export const TrendingResultBox = styled(Box)(({ theme }) => ({
  padding: "12px",
  backgroundColor: `${theme.palette.primary.main}0f`,
  borderRadius: "8px",
  borderLeft: `3px solid ${theme.palette.primary.main}`,
  marginTop: "4px",
}));

export const TrendingResultText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
}));

export const TrendingLoadingBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px 0",
});

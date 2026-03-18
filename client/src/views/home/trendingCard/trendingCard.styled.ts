import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  styled,
} from "@mui/material";

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

export const TrendingTopicList = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "4px",
});

export const TrendingTopicCard = styled(Box)(({ theme }) => ({
  padding: "10px 12px",
  backgroundColor: `${theme.palette.primary.main}0f`,
  borderRadius: "8px",
  borderLeft: `3px solid ${theme.palette.primary.main}`,
}));

export const TrendingTopicName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "0.85rem",
  color: theme.palette.primary.main,
}));

export const TrendingTopicSummary = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  marginTop: "2px",
}));

export const TrendingGeneratedAt = styled(Typography)(({ theme }) => ({
  fontSize: "0.72rem",
  color: theme.palette.text.secondary,
  textAlign: "right",
  marginTop: "4px",
}));

export const TrendingEmptyText = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  padding: "8px 0",
}));

export const TrendingLoadingBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px 0",
});

export const TrendingLoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

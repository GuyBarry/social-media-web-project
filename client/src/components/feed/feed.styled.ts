import { Box, styled } from "@mui/material";

export const FeedContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "16px",
});

export const FeedPagination = styled(Box)({
  display: "flex",
  justifyContent: "center",
  paddingTop: "8px",
  paddingBottom: "16px",
});

export const FeedGrid = styled(Box)<{ $columns: number }>(({ $columns }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${$columns}, 1fr)`,
  gap: "15px",
}));

export const FeedCenter = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "48px 0",
});

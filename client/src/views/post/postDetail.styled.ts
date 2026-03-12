import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PostDetailPage = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  minHeight: "100vh",
  paddingBottom: 48,
});

export const PostDetailHeader = styled(Box)({
  width: "85%",
  display: "flex",
  alignItems: "center",
  padding: "16px 0 8px",
});

export const BackButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "none",
  border: "none",
  cursor: "pointer",
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  fontWeight: 600,
  padding: "6px 8px",
  borderRadius: 8,
  transition: "color 0.2s ease, background-color 0.2s ease",
  outline: "none",

  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },

  "&:focus": {
    outline: "none",
  },
}));

export const PostDetailContent = styled(Box)({
  width: "85%",
  display: "flex",
  flexDirection: "row",
  gap: 24,
  alignItems: "flex-start",
});

export const PostStickyColumn = styled(Box)({
  flex: "0 0 520px",
  position: "sticky",
  top: 20,
});

export const CommentsColumn = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
});


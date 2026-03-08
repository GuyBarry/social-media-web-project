import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PostCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

export const PostHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
});

export const PostUserInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 5,
});

export const PostUsername = styled(Typography)({
  fontWeight: 600,
  fontSize: "0.9rem",
  lineHeight: 1.2,
});

export const PostTimestamp = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
}));

export const PostCaption = styled(Typography)({
  padding: "4px 16px 10px",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
});

export const PostImageContainer = styled(Box)({
  width: "100%",
  aspectRatio: 3 / 2,
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

export const PostImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  display: "block",
});

export const PostEngagementBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 16,
  padding: "8px 12px",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const EngagementItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  cursor: "pointer",
  "& > *": {
    color: theme.palette.text.secondary,
  },
}));

export const EngagementText = styled(Typography)({
  fontSize: "0.85rem",
  fontWeight: 500,
  lineHeight: 1,
});

export const LikeButton = styled("div")<{ isLiked?: boolean }>(
  ({ isLiked }) => ({
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    size: "small",
    cursor: "pointer",

    "& > *": {
      transition: "color 0.2s ease",
      ...(isLiked ? { color: "#d32f2f" } : {}),
    },

    "&:hover > *": {
      color: "#d32f2f",
    },
  }),
);

export const CommentButton = styled("div")({
  padding: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  size: "small",
  cursor: "pointer",

  "& > *": {
    transition: "color 0.2s ease",
  },

  "&:hover > *": {
    color: "#1976d2",
  },
});

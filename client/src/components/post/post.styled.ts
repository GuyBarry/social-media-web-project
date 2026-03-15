import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PostCard = styled(Box)({
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  width: "100%",

  transition: "box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
});

export const PostHeader = styled(Box)({
  position: "relative",
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

export const PostCaptionWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "truncated" && prop !== "$isRTL",
})<{ truncated?: boolean; $isRTL?: boolean }>(({ truncated, $isRTL }) => ({
  padding: "4px 16px 10px",
  display: truncated ? "flex" : "block",
  alignItems: "baseline",
  gap: 4,
  overflow: "hidden",
  direction: $isRTL ? "rtl" : "ltr",
}));

export const PostCaption = styled(Typography)<{ truncated?: boolean }>(
  ({ truncated }) => ({
    fontSize: "0.9rem",
    lineHeight: 1.5,
    wordBreak: truncated ? undefined : "break-word",
    whiteSpace: truncated ? "nowrap" : "pre-wrap",
    overflow: truncated ? "hidden" : undefined,
    textOverflow: truncated ? "ellipsis" : undefined,
    flex: truncated ? "1 1 0" : undefined,
    minWidth: 0,
  }),
);

export const CaptionToggleButton = styled("button")(({ theme }) => ({
  flexShrink: 0,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
  fontWeight: 400,
  outline: "none",
  whiteSpace: "nowrap",
  lineHeight: 1.5,
  "&:hover": { color: theme.palette.text.primary },
  "&:focus": { outline: "none" },
}));

export const PostImageContainer = styled(Box)({
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
});

export const PostImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
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

export const PostActionsGroup = styled(Box)({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "2px",
});

const ActionButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  borderRadius: "50%",
  padding: 4,
  cursor: "pointer",
  color: theme.palette.text.disabled,
  transition: "color 0.2s ease, background-color 0.2s ease",
  outline: "none",
  "&:focus": { outline: "none" },
}));

export const PostEditButton = styled(ActionButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: "rgba(25, 118, 210, 0.08)",
  },
}));

export const PostDeleteButton = styled(ActionButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.error.main,
    backgroundColor: "rgba(211, 47, 47, 0.08)",
  },
}));

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

export const EditPostDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: 12,
    overflow: "hidden",
  },
});

export const EditPostDialogContent = styled(DialogContent)({
  padding: 0,
});

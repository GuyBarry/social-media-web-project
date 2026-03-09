import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CommentsSection = styled(Box)({
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "16px",
});

export const CommentsSectionHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const CommentsSectionTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "0.95rem",
});

export const CommentsList = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const CommentItem = styled(Box)({
  display: "flex",
  padding: "8px 0",
  gap: 10,
});

export const CommentDeleteButton = styled("button")(({ theme }) => ({
  marginLeft: "auto",
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
  flexShrink: 0,

  "&:focus": { outline: "none" },

  "&:hover": {
    color: theme.palette.error.main,
    backgroundColor: "rgba(211, 47, 47, 0.08)",
  },
}));

export const CommentContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 3,
  backgroundColor: theme.palette.background.default,
  padding: "10px",
  borderRadius: 12,
  borderTopLeftRadius: 0,
}));

export const CommentSenderRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const CommentUsername = styled(Typography)({
  fontWeight: 600,
  fontSize: "0.85rem",
  lineHeight: 1.2,
});

export const CommentTimestamp = styled(Typography)(({ theme }) => ({
  fontSize: "0.72rem",
  color: theme.palette.text.disabled,
  lineHeight: 1.2,
}));

export const CommentText = styled(Typography)({
  fontSize: "0.9rem",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
});

export const AddCommentBox = styled(Box)({
  display: "flex",
  gap: 10,
  alignItems: "center",
});

export const CommentTextarea = styled("textarea")(({ theme }) => ({
  flex: 1,
  resize: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  lineHeight: 1.5,
  outline: "none",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: 40,
  maxHeight: 120,
  fieldSizing: "content",
  transition: "border-color 0.2s ease",
  borderColor: theme.palette.grey[300],

  "&:focus": {
    borderColor: theme.palette.primary.main,
  },

  "&::placeholder": {
    color: theme.palette.text.disabled,
  },
}));

export const SubmitCommentButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: theme.palette.primary.main,
  borderRadius: "50%",
  padding: 6,
  transition: "background-color 0.2s ease",
  outline: "none",

  "&:disabled": {
    color: theme.palette.text.disabled,
    cursor: "default",
  },

  "&:not(:disabled):hover": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:focus": {
    outline: "none",
  },
}));

export const LoadMoreButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: theme.palette.primary.main,
  fontSize: "0.85rem",
  fontWeight: 600,
  marginTop: 8,
  padding: "10px 16px",
  width: "100%",
  textAlign: "center",
  transition: "background-color 0.2s ease",
  outline: "none",
  borderTop: `1px solid ${theme.palette.divider}`,

  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },

  "&:focus": {
    outline: "none",
  },
}));

export const EmptyCommentsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: "0.88rem",
  padding: "5px",
  textAlign: "center",
}));

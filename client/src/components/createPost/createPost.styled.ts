import { Box, InputBase, styled } from "@mui/material";

export const CreatePostContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
  backgroundColor: "var(--background-paper, #ffffff)",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  width: "100%",
  boxSizing: "border-box",
}));

export const CreatePostInputRow = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  width: "100%",
});

export const CreatePostInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: "10px 16px",
  borderRadius: "16px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.05)",
  fontSize: "0.95rem",
  alignItems: "flex-start",
  "& textarea": {
    padding: 0,
    resize: "none",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.08)",
  },
}));

export const CreatePostActionsRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "4px",
  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
});

export const PhotoButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "7px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  userSelect: "none",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.06)",
    color: theme.palette.success.main,
  },
}));

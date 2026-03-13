import { Box, IconButton, InputBase, styled } from "@mui/material";

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

export const CreatePostInput = styled(InputBase)<{ error?: boolean }>(
  ({ theme, error }) => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: "16px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.05)",
    fontSize: "0.95rem",
    alignItems: "flex-start",
    border: error
      ? `1.5px solid ${theme.palette.error.main}`
      : "1.5px solid transparent",
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
  }),
);

export const CreatePostActionsRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "12px",
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

export const ImagePreviewWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "12px",
  overflow: "hidden",
  lineHeight: 0,
});

export const ImagePreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  borderRadius: "12px",
});

export const ImagePreviewRemoveButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.45)",
  color: "#fff",
  padding: "4px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.65)",
  },
}));

export const ContentErrorText = styled("p")(({ theme }) => ({
  margin: 0,
  paddingLeft: "54px",
  marginTop: "-8px",
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.error.main,
}));

export const PhotoButtonGroup = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const PhotoErrorText = styled("p")(({ theme }) => ({
  margin: 0,
  paddingLeft: "14px",
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.error.main,
}));

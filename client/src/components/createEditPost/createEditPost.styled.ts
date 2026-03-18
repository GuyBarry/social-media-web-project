import { Box, IconButton, InputBase, Typography, styled } from "@mui/material";

export const CreateEditPostContainer = styled(Box)(() => ({
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

export const CreateEditPostInputRow = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  width: "100%",
});

export const CreateEditPostInput = styled(InputBase)(
  ({ theme }) => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: "16px",
    borderTopLeftRadius: 0,
    backgroundColor: theme.palette.background.default,
    fontSize: "0.95rem",
    alignItems: "flex-start",
    border: "1.5px solid transparent",
    "& textarea": {
      padding: 0,
      resize: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)",
    },
  }),
);

export const CreateEditPostButtonsRow = styled(Box)({
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
    color: theme.palette.primary.main,
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

export const ActionButtonsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

export const MoodButtonsRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "nowrap",
  paddingTop: "0px",
  width: "100%",
});

export const MoodButtonWrapper = styled("div")<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    position: "relative",
    flex: 1,
    minWidth: "0",
    "& button": {
      width: "100%",
      ...(selected && {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        borderColor: theme.palette.primary.main,
      }),
    },
  }),
);

export const MoodButtonText = styled("span")<{ loading?: boolean }>(
  ({ loading }) => ({
    marginLeft: loading ? "20px" : "0",
  }),
);

export const MoodLoadingSpinner = styled("div")({
  position: "absolute",
  left: "8px",
});

export const MoodSuggestionBox = styled(Box)(({ theme }) => ({
  borderRadius: "12px",
  border: `1.5px solid ${theme.palette.primary.main}`,
  padding: "12px 14px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.02)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));

export const MoodSuggestionText = styled(Typography)({
  whiteSpace: "pre-wrap",
});

export const MoodSuggestionActions = styled(Box)({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
});
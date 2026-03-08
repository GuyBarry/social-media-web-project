import { Box, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const AVATAR_SIZE = 88;

export const AvatarWrapper = styled(Box)({
  position: "relative",
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  cursor: "pointer",
  borderRadius: "50%",
  "& .avatar-overlay": {
    opacity: 0,
    transition: "opacity 0.2s ease",
  },
  "&:hover .avatar-img": {
    filter: "blur(2px) brightness(0.65)",
  },
  "&:hover .avatar-overlay": {
    opacity: 1,
  },
});

export const AvatarCameraOverlay = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  pointerEvents: "none",
  color: "#fff",
});

export const EditFormBox = styled(Box)({
  padding: "12px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: 4,
  fontSize: "0.8rem",
}));

export const FieldInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[400],
    },
  },
}));

export const EditFieldRow = styled(Stack)({
  flexDirection: "row",
});

export const EditFieldItem = styled(Box)({
  flex: 1,
});

export const EditActionsRow = styled(Stack)({
  flexDirection: "row",
  gap: 12,
});

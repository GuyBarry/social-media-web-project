import { Box, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const AVATAR_SIZE = 88;

export const AvatarColumnBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
});

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

export const EditContentRow = styled(Box)({
  display: "flex",
  gap: 24,
  alignItems: "stretch",
});

export const EditFormColumn = styled(Box)({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const EditFieldRow = styled(Stack)({
  flexDirection: "row",
});

export const EditFieldItem = styled(Box)({
  flex: 1,
});

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

export const EditColorColumn = styled(Box)({
  flex: 1,
});

export const EditActionsRow = styled(Stack)({
  flexDirection: "row",
  gap: 12,
});

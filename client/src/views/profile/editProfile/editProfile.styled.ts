import { Box, Stack, Typography } from "@mui/material";
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
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 12,
  paddingBottom: 24,
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: 4,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: 0.5,
}));

export const EditFieldRow = styled(Stack)({
  width: "60%",
});

export const EditFieldItem = styled(Box)({
  flex: 1,
});

export const EditFieldWide = styled(Box)({
  width: "60%",
});

export const EditActionsRow = styled(Stack)({
  flexDirection: "row",
  gap: 12,
});

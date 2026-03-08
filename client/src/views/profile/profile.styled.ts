import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const BANNER_HEIGHT = 140;
const AVATAR_SIZE = 88;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

export const ProfilePage = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  paddingTop: 32,
  paddingLeft: 16,
  paddingRight: 16,
});

export const ProfileCard = styled(Card)({
  width: "100%",
  maxWidth: 1000,
  borderRadius: 16,
  overflow: "visible",
});

export const ProfileBanner = styled(Box)<{ bannercolor: string }>(
  ({ bannercolor }) => ({
    height: BANNER_HEIGHT,
    backgroundColor: bannercolor,
    borderRadius: "16px 16px 0 0",
  }),
);

export const AvatarRow = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  paddingLeft: 24,
  paddingRight: 24,
  marginTop: -AVATAR_OVERLAP,
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

export const EditProfileButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  borderColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[100],
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
    borderColor: theme.palette.grey[400],
  },
}));

export const UserInfoBox = styled(Box)({
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 12,
  paddingBottom: 0,
});

export const DisplayName = styled(Typography)({
  fontWeight: 700,
  lineHeight: 1.2,
});

export const HandleText = styled(Typography)({
  marginTop: 2,
});

export const BioText = styled(Typography)({
  marginTop: 10,
});

export const MetaStack = styled(Stack)({
  paddingLeft: 24,
  paddingRight: 24,
  flexWrap: "wrap",
  marginTop: 12,
});

export const MetaItem = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
});

export const ProfileDivider = styled(Divider)({
  marginLeft: 24,
  marginRight: 24,
  marginTop: 16,
  marginBottom: 16,
});

export const StatsStack = styled(Stack)({
  paddingLeft: 24,
  paddingRight: 24,
  paddingBottom: 24,
});

export const StatItem = styled(Stack)({
  alignItems: "center",
});

export const StatValue = styled(Typography)({
  fontWeight: 700,
  lineHeight: 1.1,
});

export const StatLabel = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: theme.palette.text.secondary,
}));

export const EditFormBox = styled(Box)({
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 12,
  paddingBottom: 24,
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const SaveButton = styled(Button)({
  borderRadius: 20,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: 20,
  paddingRight: 20,
});

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: 20,
  paddingRight: 20,
  borderColor: theme.palette.grey[300],
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[400],
  },
}));

export const EditFieldItem = styled(Box)({
  flex: 1,
});

export const MetaText = styled(Typography)({
  margin: 0,
  display: "flex",
  alignItems: "center",
});

export const EditActionsRow = styled(Stack)({
  flexDirection: "row",
  gap: 12,
});

export const AvatarColumnBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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

export const EditColorColumn = styled(Box)({
  flex: 1,
});

export const AvatarDeleteButton = styled(Button)(({ theme }) => ({
  marginTop: 8,
  borderRadius: 20,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.75rem",
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  paddingLeft: 12,
  paddingRight: 12,
  "&:hover": {
    backgroundColor: theme.palette.error.light + "22",
    borderColor: theme.palette.error.dark,
  },
}));

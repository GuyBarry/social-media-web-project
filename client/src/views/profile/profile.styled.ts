import { Avatar, Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const BANNER_HEIGHT = 140;
const AVATAR_SIZE = 88;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

export { BANNER_HEIGHT, AVATAR_SIZE, AVATAR_OVERLAP };

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

export const ProfileBanner = styled(Box)<{ bannercolor: string }>(({ bannercolor }) => ({
  height: BANNER_HEIGHT,
  backgroundColor: bannercolor,
  borderRadius: "16px 16px 0 0",
}));

export const AvatarRow = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  paddingLeft: 24,
  paddingRight: 24,
  marginTop: -AVATAR_OVERLAP,
});

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  backgroundColor: theme.palette.secondary.main,
  fontSize: "2rem",
  fontWeight: 700,
  boxShadow: theme.shadows[2],
}));

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
  paddingTop: 12,
  paddingBottom: 4,
  flexWrap: "wrap",
});

export const MetaItem = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
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

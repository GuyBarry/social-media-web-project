import { Box, Card, Divider, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const BANNER_HEIGHT = 100;
const AVATAR_SIZE = 88;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

export const ProfilePage = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  minHeight: "100vh",
  paddingTop: 32,
  paddingInline: "7vw",
  gap: 20,
});

export const ProfileCard = styled(Card)({
  width: "100%",
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

export const AvatarRow = styled(Stack)({
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "space-between",
  paddingLeft: 24,
  paddingRight: 24,
  marginTop: -AVATAR_OVERLAP,
});

export const ProfileDivider = styled(Divider)({
  marginInline: 24,
  marginTop: 16,
  marginBottom: 10,
});

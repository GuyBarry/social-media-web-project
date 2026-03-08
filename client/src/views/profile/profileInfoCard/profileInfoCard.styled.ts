import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

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

export const MetaText = styled(Typography)({
  margin: 0,
  display: "flex",
  alignItems: "center",
});

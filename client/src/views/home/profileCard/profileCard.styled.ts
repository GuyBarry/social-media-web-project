import { Box, Divider, Typography, styled } from "@mui/material";

export const ProfileCardContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  padding: "30px 16px",
  backgroundColor: "var(--background-paper, #ffffff)",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  width: "100%",
  boxSizing: "border-box",
});

export const ProfileCardUsername = styled(Typography)({
  textAlign: "center",
  padding: "10px 0",
});

export const ProfileCardEmail = styled(Typography)({
  textAlign: "center",
  wordBreak: "break-all",
  padding: "10px 0",
});

export const ProfileCardDivider = styled(Divider)({
  width: "100%",
  margin: "4px 0",
  padding: "10px 0",
});

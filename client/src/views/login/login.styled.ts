import { Box, styled } from "@mui/material";

export const LoginContainer = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  backgroundColor: "var(--mui-palette-background-default)",
});

export const LoginFormPanel = styled(Box)({
  width: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  overflowY: "auto",
});

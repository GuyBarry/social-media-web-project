import {
  Alert,
  Box,
  Button,
  Divider,
  Link,
  Typography,
  styled,
} from "@mui/material";

export const RegisterContainer = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  backgroundColor: "var(--mui-palette-background-default)",
});

export const RegisterFormPanel = styled(Box)({
  width: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  overflowY: "auto",
});

export const RegisterTitle = styled(Typography)({
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "8px",
});

export const RegisterSubtitle = styled(Typography)({
  textAlign: "center",
  marginBottom: "16px",
});

export const RegisterAlert = styled(Alert)({
  marginBottom: "16px",
});

export const RegisterPasswordRow = styled(Box)({
  display: "flex",
  gap: "16px",
});

export const RegisterSubmitButton = styled(Button)({
  marginTop: "24px",
  marginBottom: "16px",
  paddingTop: "12px",
  paddingBottom: "12px",
});

export const RegisterDivider = styled(Divider)({
  marginTop: "24px",
  marginBottom: "24px",
});

export const RegisterGoogleButton = styled(Button)({
  paddingTop: "12px",
  paddingBottom: "12px",
});

export const RegisterFooterText = styled(Typography)({
  textAlign: "center",
  marginTop: "24px",
});

export const RegisterLink = styled(Link)({
  color: "primary.main",
  fontWeight: 600,
}) as typeof Link;

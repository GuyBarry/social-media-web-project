import { Box, styled } from "@mui/material";

export const NavbarRoot = styled(Box)({
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 32px",
  backgroundColor: "var(--background-paper, #ffffff)",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
  height: "var(--navbar-height)",
});

export const NavbarLogo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
});

export const NavbarProfile = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "8px",
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
});

import { Box, styled } from "@mui/material";

export const HomeContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
  width: "100%",
  backgroundColor: "var(--background-default)",
  gap: "16px",
  paddingInline: "5%",

  "> *": {
    padding: "30px 10px",
  },
});

export const HomeSidebar = styled("aside")({
  position: "sticky",
  top: "var(--navbar-height)",
  alignSelf: "start",
});

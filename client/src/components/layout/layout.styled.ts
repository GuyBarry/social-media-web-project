import { Box, styled } from "@mui/material";

export const AppContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",

  "> main": {
    flex: 1,
  },
});

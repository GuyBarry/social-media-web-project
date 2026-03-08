import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "'Rubik', system-ui, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#667eea",
      dark: "#535bf2",
    },
    secondary: {
      main: "#764ba2",
    },
    background: {
      default: "#f9f8f8",
    },
    text: {
      primary: "#1f1f1f",
      secondary: "#757575",
    },
  },
});
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface ThemeOptions {
    banner?: {
      1?: string;
      2?: string;
      3?: string;
      4?: string;
      5?: string;
      6?: string;
      7?: string;
      8?: string;
      9?: string;
    };
  }
}

export const theme = createTheme({
  cssVariables: true,
  banner: {
    1: "#8497eeff",
    2: "#764ba2",
    3: "#f093fb",
    4: "#4facfe",
    5: "#43e97b",
    6: "#fa709a",
    7: "#a18cd1",
    8: "#fccb90",
    9: "#ff9a9e",
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
      default: "#f5f5f5",
    },
    text: {
      primary: "#1f1f1f",
      secondary: "#757575",
    },
  },
});
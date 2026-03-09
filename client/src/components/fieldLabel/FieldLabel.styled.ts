import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: 4,
  fontSize: "0.8rem",
}));

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CostumButton = styled(Button)(() => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: 20,
  paddingRight: 20,
  "&:focus": {
    outline: "none",
  },
  "&.Mui-focusVisible": {
    boxShadow: "none",
  },
}));

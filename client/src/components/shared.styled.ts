import { Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ProfileAvatar = styled(Avatar)<{ size?: number }>(
  ({ theme, size }) => ({
    width: size ?? 88,
    height: size ?? 88,
    backgroundColor: theme.palette.primary.main,
    fontSize: "2rem",
    fontWeight: 700,
    boxShadow: theme.shadows[1],
    transition: "filter 0.2s ease",
  }),
);

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

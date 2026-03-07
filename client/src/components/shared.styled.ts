import { Avatar, IconButton } from "@mui/material";
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

export const IconButton2 = styled(IconButton)({
  "&:focus": {
    outline: "none",
    boxShadow: "none",
  },
  "&.Mui-focusVisible": {
    outline: "none",
    boxShadow: "none",
  },
  ":hover": {
    backgroundColor: "transparent",
  },
  "&:active": {
    backgroundColor: "transparent",
  },
});

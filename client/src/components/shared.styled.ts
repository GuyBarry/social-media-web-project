import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ProfileAvatar = styled(Avatar)<{ size?: number }>(
  ({ theme, size }) => ({
    width: size ?? 88,
    height: size ?? 88,
    backgroundColor: theme.palette.primary.main,
    fontSize: "2rem",
    fontWeight: 700,
    boxShadow: theme.shadows[2],
    transition: "filter 0.2s ease",
  }),
);

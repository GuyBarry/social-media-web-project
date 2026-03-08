import { Logout as LogoutIcon } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/authContext";
import { avatarImageSlotProps } from "../../views/profile/profile.utils";
import { ProfileAvatar } from "../shared.styled";
import "./navbar.css";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    await logout({
      onError: () => console.error("Logout failed"),
    });
  };

  if (!user) return null;

  return (
    <Box className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <Share2 size={22} color="var(--mui-palette-primary-main, #1976d2)" />
        <Typography variant="h6" fontWeight={700} color="primary.main">
          SocialApp
        </Typography>
      </div>

      <Box display="flex" alignItems="center" gap={2}>
        <div className="navbar-profile" onClick={handleProfileClick}>
          <Typography variant="body2" color="text.secondary">
            {user?.username}
          </Typography>
          <ProfileAvatar
            size={44}
            src={user.imageUrl ?? undefined}
            slotProps={avatarImageSlotProps}
          >
            {user.username.charAt(0).toUpperCase()}
          </ProfileAvatar>
        </div>
        <IconButton
          onClick={handleLogout}
          title="Logout"
          size="small"
          sx={{
            color: "error.main",
            borderRadius: "6px",
            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
          }}
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

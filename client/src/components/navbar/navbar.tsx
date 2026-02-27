import { Logout as LogoutIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
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
          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
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

import { Avatar, Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import "./profileCard.css";

export const ProfileCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-card">
      <Avatar className="profile-card-avatar" sx={{ bgcolor: "primary.main" }}>
        {user?.username?.[0]?.toUpperCase() ?? "U"}
      </Avatar>

      <Typography
        variant="subtitle1"
        fontWeight={600}
        className="profile-card-username"
      >
        {user?.username}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="profile-card-email"
      >
        {user?.email}
      </Typography>

      <Divider className="profile-card-divider" />

      <div className="profile-card-stats">
        <Typography variant="h6" fontWeight={700}>
          0
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Posts
        </Typography>
      </div>

      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate("/profile")}
        className="profile-card-btn"
      >
        View Profile
      </Button>
    </div>
  );
};

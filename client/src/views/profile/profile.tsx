import { Typography } from "@mui/material";
import { useAuth } from "../../context/authContext";
import "./profile.css";

export const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <Typography variant="h5" fontWeight={600}>
        Profile Screen, {user?.username}
      </Typography>
    </div>
  );
};

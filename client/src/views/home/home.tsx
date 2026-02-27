import { Typography } from "@mui/material";
import { useAuth } from "../../context/authContext";
import "./home.css";

export const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Typography variant="h5" fontWeight={600}>
        Home Screen, {user?.username}
      </Typography>
    </div>
  );
};

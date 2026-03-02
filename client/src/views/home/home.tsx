import { Typography } from "@mui/material";
import { useAuth } from "../../context/authContext";
import { ProfileCard } from "./profileCard/profileCard";
import "./home.css";

export const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <aside className="home-sidebar">
        <ProfileCard />
      </aside>
      <main className="home-main">
        <Typography variant="h5" fontWeight={600}>
          Home Screen, {user?.username}
        </Typography>
      </main>
      <aside className="home-sidebar">
        <Typography variant="h5" fontWeight={600}>
          AI
        </Typography>
      </aside>
    </div>
  );
};

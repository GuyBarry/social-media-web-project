import { Typography } from "@mui/material";
import { FeedComponent } from "../../components/feed/feed";
import { ProfileCard } from "./profileCard/profileCard";
import "./home.css";

export const HomeScreen = () => {
  return (
    <div className="home-container">
      <aside className="home-sidebar">
        <ProfileCard />
      </aside>
      <main className="home-main">
        <FeedComponent />
      </main>
      <aside className="home-sidebar">
        <Typography variant="h5" fontWeight={600}>
          AI
        </Typography>
      </aside>
    </div>
  );
};

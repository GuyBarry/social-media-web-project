import { Typography } from "@mui/material";
import { FeedComponent } from "../../components/feed/feed";
import { ProfileCard } from "./profileCard/profileCard";
import { useGetAllPostsInfinite } from "../../react/hooks/usePosts";
import "./home.css";

const HOME_POSTS_PER_PAGE = 3;

export const HomeScreen = () => {
  const queryResult = useGetAllPostsInfinite(HOME_POSTS_PER_PAGE);

  return (
    <div className="home-container">
      <aside className="home-sidebar">
        <ProfileCard />
      </aside>
      <main className="home-main">
        <FeedComponent queryResult={queryResult} />
      </main>
      <aside className="home-sidebar">
        <Typography variant="h5" fontWeight={600}>
          AI
        </Typography>
      </aside>
    </div>
  );
};

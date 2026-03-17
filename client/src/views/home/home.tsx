import { Box } from "@mui/material";
import { FeedComponent } from "../../components/feed/feed";
import { CreatePost } from "../../components/createEditPost/createPost";
import { ProfileCard } from "./profileCard/profileCard";
import { TrendingCard } from "./trendingCard/trendingCard";
import { useGetAllPostsInfinite } from "../../react/hooks/usePosts";
import { useGetUserById } from "../../react/hooks/useUsers";
import { HomeContainer, HomeSidebar } from "./home.styled";

const HOME_POSTS_PER_PAGE = 3;

export const HomeScreen = () => {
  const { data: user } = useGetUserById();
  const queryResult = useGetAllPostsInfinite(HOME_POSTS_PER_PAGE);

  return (
    <HomeContainer>
      <HomeSidebar>
        {user && <ProfileCard user={user} />}
      </HomeSidebar>
      <main>
        <Box display="flex" flexDirection="column" gap="16px">
          {user && <CreatePost user={user} />}
          <FeedComponent queryResult={queryResult} />
        </Box>
      </main>
      <HomeSidebar>
        <TrendingCard />
      </HomeSidebar>
    </HomeContainer>
  );
};

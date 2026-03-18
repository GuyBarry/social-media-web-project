import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../auth/context/authContext";
import { FeedComponent } from "../../components/feed/feed";
import { useGetPostsBySender } from "../../react/hooks/usePosts";
import { useGetUserById } from "../../react/hooks/useUsers";
import { EditProfileScreen } from "./editProfile/editProfile";
import { ProfilePage } from "./profile.styled";
import { ProfileInfoCard } from "./profileInfoCard/profileInfoCard";

const PROFILE_POSTS_PER_PAGE = 6;

export const ProfileScreen = () => {
  const { userId } = useAuth();
  const { data: user } = useGetUserById();
  const [isEditing, setIsEditing] = useState(false);
  const queryResult = useGetPostsBySender(
    userId ?? "",
    PROFILE_POSTS_PER_PAGE,
  );

  if (!userId || !user) return null;

  if (isEditing) {
    return (
      <EditProfileScreen
        user={user}
        onCancel={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfilePage>
      <ProfileInfoCard user={user} onEditClick={() => setIsEditing(true)} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <PhotoOutlinedIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          My Posts
        </Typography>
      </Stack>

      <FeedComponent queryResult={queryResult} columns={3} forceAspectRatio="1 / 1" />
    </ProfilePage>
  );
};

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../auth/context/authContext";
import { FeedComponent } from "../../components/feed/feed";
import { ProfileAvatar } from "../../components/shared.styled";
import { useGetPostsBySender } from "../../react/hooks/usePosts";
import { EditProfileScreen } from "./editProfile";
import {
  AvatarRow,
  BioText,
  DisplayName,
  EditProfileButton,
  HandleText,
  MetaItem,
  MetaStack,
  MetaText,
  ProfileBanner,
  ProfileCard,
  ProfileDivider,
  ProfilePage,
  StatItem,
  StatLabel,
  StatValue,
  StatsStack,
  UserInfoBox,
} from "./profile.styled";
import { avatarImageSlotProps } from "./profile.utils";

const PROFILE_POSTS_PER_PAGE = 6;

export const ProfileScreen = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryResult = useGetPostsBySender(
    user?._id ?? "",
    PROFILE_POSTS_PER_PAGE,
  );

  if (!user) return null;

  if (isEditing) {
    return (
      <EditProfileScreen
        onCancel={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  const bannerColor = "#8497eeff";
  const displayName = user.username;
  const handle = `@${user.username.toLowerCase().replace(/\s+/g, "")}`;
  const bio = user.bio ?? "No bio yet.";
  const birthDateParsed = user.birthDate ? new Date(user.birthDate) : null;
  const birthDate =
    birthDateParsed && !isNaN(birthDateParsed.getTime())
      ? birthDateParsed.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;
  const email = user.email;
  const postsCount = user.postsCount ?? 0;
  const likesCount = user.likesCount ?? 0;

  return (
    <ProfilePage>
      <ProfileCard elevation={3}>
        <ProfileBanner bannercolor={bannerColor} />

        <AvatarRow>
          <ProfileAvatar
            src={user.imageUrl ?? undefined}
            slotProps={avatarImageSlotProps}
          >
            {displayName.charAt(0).toUpperCase()}
          </ProfileAvatar>

          <EditProfileButton
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </EditProfileButton>
        </AvatarRow>

        <UserInfoBox>
          <DisplayName variant="h6">{displayName}</DisplayName>
          <HandleText variant="body2" color="text.secondary">
            {handle}
          </HandleText>
          <BioText variant="body1">{bio}</BioText>
        </UserInfoBox>

        <MetaStack direction="row" spacing={2.5}>
          <MetaItem>
            <CalendarTodayIcon fontSize="small" color="disabled" />
            <MetaText variant="body2" color="text.secondary">
              {birthDate ?? "Unavailable"}
            </MetaText>
          </MetaItem>
          <MetaItem>
            <EmailIcon fontSize="small" color="disabled" />
            <MetaText variant="body2" color="text.secondary">
              {email}
            </MetaText>
          </MetaItem>
        </MetaStack>

        <ProfileDivider />

        <StatsStack direction="row" spacing={4}>
          {[
            { label: "POSTS", value: postsCount },
            { label: "LIKES", value: likesCount },
          ].map(({ label, value }) => (
            <StatItem key={label} spacing={0.25}>
              <StatValue variant="h6">{value.toLocaleString()}</StatValue>
              <StatLabel variant="caption">{label}</StatLabel>
            </StatItem>
          ))}
        </StatsStack>
      </ProfileCard>

      <Stack direction="row" alignItems="center" spacing={1}>
        <PhotoOutlinedIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          My Posts
        </Typography>
      </Stack>

      <FeedComponent queryResult={queryResult} columns={3} />
    </ProfilePage>
  );
};

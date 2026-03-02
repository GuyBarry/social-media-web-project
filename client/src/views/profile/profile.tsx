import { Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/authContext";
import {
  AvatarRow,
  BioText,
  DisplayName,
  EditProfileButton,
  HandleText,
  MetaItem,
  MetaStack,
  ProfileAvatar,
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

export const ProfileScreen = () => {
  const { user } = useAuth();

  if (!user) return null;

  const bannerColor = user.bannerColor ?? "#667eea";
  const displayName = user.username;
  const handle = `@${user.username.toLowerCase().replace(/\s+/g, "")}`;
  const bio = user.bio ?? "No bio yet.";
  const birthDate = user.birthDate
    ? new Date(user.birthDate).toLocaleDateString("en-US", {
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
          <ProfileAvatar>
            {displayName.charAt(0).toUpperCase()}
          </ProfileAvatar>

          <EditProfileButton
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
          >
            Edit Profile
          </EditProfileButton>
        </AvatarRow>

        <UserInfoBox>
          <DisplayName variant="h6">
            {displayName}
          </DisplayName>
          <HandleText variant="body2" color="text.secondary">
            {handle}
          </HandleText>
          <BioText variant="body1">
            {bio}
          </BioText>
        </UserInfoBox>

        <MetaStack direction="row" spacing={2.5}>
          {birthDate && (
            <MetaItem spacing={0.75}>
              <CalendarTodayIcon fontSize="small" color="disabled" />
              <Typography sx={{ display: "flex", alignItems: "center" }} variant="body2" color="text.secondary">
                {birthDate}
              </Typography>
            </MetaItem>
          )}
          <MetaItem spacing={0.75}>
            <EmailIcon fontSize="small" color="disabled" />
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </MetaItem>
        </MetaStack>

        <ProfileDivider />

        <StatsStack direction="row" spacing={4}>
          {[
            { label: "POSTS", value: postsCount },
            { label: "LIKES", value: likesCount },
          ].map(({ label, value }) => (
            <StatItem key={label} spacing={0.25}>
              <StatValue variant="h6">
                {value.toLocaleString()}
              </StatValue>
              <StatLabel variant="caption">
                {label}
              </StatLabel>
            </StatItem>
          ))}
        </StatsStack>
      </ProfileCard>
    </ProfilePage>
  );
};

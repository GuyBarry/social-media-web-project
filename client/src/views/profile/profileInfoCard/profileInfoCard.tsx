import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import { CostumButton, ProfileAvatar } from "../../../components/shared.styled";
import { UserStats } from "../../../components/userStats/userStats";
import type { User } from "../../../entities/User";
import {
  AvatarRow,
  ProfileBanner,
  ProfileCard,
  ProfileDivider,
} from "../profile.styled";
import {
  BioText,
  DisplayName,
  HandleText,
  MetaItem,
  MetaStack,
  MetaText,
  UserInfoBox,
} from "./profileInfoCard.styled";
import { avatarImageSlotProps, resolveBannerColor } from "../profile.utils";

interface ProfileInfoCardProps {
  user: User;
  onEditClick: () => void;
}

export const ProfileInfoCard = ({
  user,
  onEditClick,
}: ProfileInfoCardProps) => {
  const bannerColor = resolveBannerColor(user.bannerColor);
  const uniqueUsername = `@${user.username.toLowerCase().replace(/\s+/g, "")}`;
  const birthDateParsed = user.birthDate ? new Date(user.birthDate) : null;
  const birthDate =
    birthDateParsed && !isNaN(birthDateParsed.getTime())
      ? birthDateParsed.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <ProfileCard elevation={3}>
      <ProfileBanner bannercolor={bannerColor} />

      <AvatarRow>
        <ProfileAvatar
          src={user.imageUrl ?? undefined}
          slotProps={avatarImageSlotProps}
        >
          {user.username.charAt(0).toUpperCase()}
        </ProfileAvatar>

        <CostumButton
          variant="outlined"
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={onEditClick}
        >
          Edit Profile
        </CostumButton>
      </AvatarRow>

      <UserInfoBox>
        <DisplayName variant="h6">{user.username}</DisplayName>
        <HandleText variant="body2" color="text.secondary">
          {uniqueUsername}
        </HandleText>
        <BioText variant="body1">{user.bio ?? "No bio yet."}</BioText>
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
            {user.email}
          </MetaText>
        </MetaItem>
      </MetaStack>

      <ProfileDivider />

      <UserStats postsCount={user.postsCount} likesCount={user.likesCount} />
    </ProfileCard>
  );
};

import { useNavigate } from "react-router-dom";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { ProfileAvatar } from "../../../components/profileAvatar/ProfileAvatar.styled";
import { UserStats } from "../../../components/userStats/userStats";
import type { User } from "../../../entities/User";
import { avatarImageSlotProps } from "../../../utils/avatar.utils";
import {
  ProfileCardContainer,
  ProfileCardDivider,
  ProfileCardEmail,
  ProfileCardUsername,
} from "./profileCard.styled";
import type { FC } from "react";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <ProfileCardContainer>
      <ProfileAvatar
        src={user.imageUrl ?? undefined}
        slotProps={avatarImageSlotProps}
      >
        {user.username.charAt(0).toUpperCase()}
      </ProfileAvatar>

      <ProfileCardUsername variant="subtitle1" fontWeight={600}>
        {user?.username}
      </ProfileCardUsername>

      <ProfileCardEmail variant="body2" color="text.secondary">
        {user?.email}
      </ProfileCardEmail>

      <ProfileCardDivider />

      <UserStats postsCount={user.postsCount} likesCount={user.likesCount} />

      <CostumButton
        variant="outlined"
        fullWidth
        onClick={() => navigate("/profile")}
      >
        View Profile
      </CostumButton>
    </ProfileCardContainer>
  );
};

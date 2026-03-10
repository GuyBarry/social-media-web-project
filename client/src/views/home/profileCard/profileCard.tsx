import { Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { ProfileAvatar } from "../../../components/profileAvatar/ProfileAvatar.styled";
import { UserStats } from "../../../components/userStats/userStats";
import type { User } from "../../../entities/User";
import { avatarImageSlotProps } from "../../../utils/avatar.utils";
import "./profileCard.css";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="profile-card">
      <ProfileAvatar
        src={user.imageUrl ?? undefined}
        slotProps={avatarImageSlotProps}
      >
        {user.username.charAt(0).toUpperCase()}
      </ProfileAvatar>

      <Typography
        variant="subtitle1"
        fontWeight={600}
        className="profile-card-username"
      >
        {user?.username}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="profile-card-email"
      >
        {user?.email}
      </Typography>

      <Divider className="profile-card-divider" />

      <UserStats postsCount={user.postsCount} likesCount={user.likesCount} />

      <CostumButton
        variant="outlined"
        fullWidth
        onClick={() => navigate("/profile")}
      >
        View Profile
      </CostumButton>
    </div>
  );
};

import { useRef, useState } from "react";
import { TextField } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/authContext";
import {
  AvatarCameraOverlay,
  AvatarRow,
  AvatarWrapper,
  BioText,
  CancelButton,
  DisplayName,
  EditActionsRow,
  EditFieldItem,
  EditFieldRow,
  EditFieldWide,
  EditFormBox,
  EditProfileButton,
  FieldLabel,
  HandleText,
  MetaItem,
  MetaStack,
  MetaText,
  ProfileAvatar,
  ProfileBanner,
  ProfileCard,
  ProfileDivider,
  ProfilePage,
  SaveButton,
  StatItem,
  StatLabel,
  StatValue,
  StatsStack,
  UserInfoBox,
} from "./profile.styled";

export const ProfileScreen = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("");
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const bannerColor = user.bannerColor ?? "#667eea";
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

  const handleEditOpen = () => {
    setEditUsername(user.username);
    setEditBio(user.bio ?? "");
    const parsedDate = user.birthDate ? new Date(user.birthDate) : null;
    setEditBirthDate(
      parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString().split("T")[0]
        : ""
    );
    setEditAvatarPreview(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditAvatarPreview(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: wire up save API call
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ProfilePage>
        <ProfileCard elevation={3}>
          <ProfileBanner bannercolor={bannerColor} />

          <AvatarRow>
            <AvatarWrapper onClick={() => fileInputRef.current?.click()}>
              <ProfileAvatar className="avatar-img" src={editAvatarPreview ?? undefined}>
                {!editAvatarPreview && displayName.charAt(0).toUpperCase()}
              </ProfileAvatar>
              <AvatarCameraOverlay className="avatar-overlay">
                <CameraAltIcon fontSize="medium" />
              </AvatarCameraOverlay>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setEditAvatarPreview(url);
                }}
              />
            </AvatarWrapper>
          </AvatarRow>

          <EditFormBox>
            <EditFieldRow direction="row" spacing={2}>
              <EditFieldItem>
                <FieldLabel>Username</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </EditFieldItem>

              <EditFieldItem>
                <FieldLabel>Birth Date</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={editBirthDate}
                  onChange={(e) => setEditBirthDate(e.target.value)}
                />
              </EditFieldItem>
            </EditFieldRow>

            <EditFieldWide>
              <FieldLabel>Description</FieldLabel>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={3}
                placeholder="Tell something about yourself..."
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />
            </EditFieldWide>

            <EditActionsRow>
              <SaveButton variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </SaveButton>
              <CancelButton variant="outlined" onClick={handleCancel}>
                Cancel
              </CancelButton>
            </EditActionsRow>
          </EditFormBox>
        </ProfileCard>
      </ProfilePage>
    );
  }

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
          <ProfileAvatar>{displayName.charAt(0).toUpperCase()}</ProfileAvatar>

          <EditProfileButton
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            onClick={handleEditOpen}
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
          <MetaItem >
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
    </ProfilePage>
  );
};

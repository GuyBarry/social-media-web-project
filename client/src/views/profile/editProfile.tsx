import { useRef, useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAuth } from "../../context/authContext";
import {
  AvatarCameraOverlay,
  AvatarColumnBox,
  AvatarDeleteButton,
  AvatarRow,
  AvatarWrapper,
  CancelButton,
  EditActionsRow,
  EditColorColumn,
  EditContentRow,
  EditFieldItem,
  EditFormBox,
  EditFormColumn,
  ProfileBanner,
  ProfileCard,
  ProfilePage,
  SaveButton,
} from "./profile.styled";
import { FieldLabel, ProfileAvatar } from "../../components/shared.styled";
import { avatarImageSlotProps, resolveBannerColor } from "./profile.utils";
import { updateUser } from "./profileApi";
import { BannerColorPicker } from "../../components/colorPicker/BannerColorPicker";

interface EditProfileScreenProps {
  onCancel: () => void;
  onSave: () => void;
}

export const EditProfileScreen = ({
  onCancel,
  onSave,
}: EditProfileScreenProps) => {
  const { user, refreshUser } = useAuth();
  const [editUsername, setEditUsername] = useState(user?.username ?? "");
  const [editBio, setEditBio] = useState(user?.bio ?? "");
  const [editBirthDate, setEditBirthDate] = useState(() => {
    const parsed = user?.birthDate ? new Date(user.birthDate) : null;
    return parsed && !isNaN(parsed.getTime())
      ? parsed.toISOString().split("T")[0]
      : "";
  });
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(
    user?.imageUrl ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bannerColor, setBannerColor] = useState(
    resolveBannerColor(user?.bannerColor),
  );

  if (!user) return null;

  const displayName = user.username;

  const handleSave = async () => {
    const formData = new FormData();

    if (editUsername !== user.username)
      formData.append("username", editUsername);
    if (editBio !== (user.bio ?? "")) formData.append("bio", editBio);
    if (editBirthDate) {
      const existingDate =
        user.birthDate instanceof Date && !isNaN(user.birthDate.getTime())
          ? user.birthDate.toISOString().split("T")[0]
          : "";
      if (editBirthDate !== existingDate) {
        formData.append("birthDate", editBirthDate);
      }
    }
    if (selectedFile) formData.append("image", selectedFile);
    if (deleteImage) formData.append("imageUrl", "");

    const originalBanner = user.bannerColor ?? "1";
    if (bannerColor !== resolveBannerColor(originalBanner))
      formData.append("bannerColor", bannerColor);

    await updateUser(user._id, formData);
    await refreshUser();
    onSave();
  };

  return (
    <ProfilePage>
      <ProfileCard elevation={3}>
        <ProfileBanner bannercolor={bannerColor} />

        <AvatarRow>
          <AvatarColumnBox>
            <AvatarWrapper onClick={() => fileInputRef.current?.click()}>
              <ProfileAvatar
                className="avatar-img"
                src={editAvatarPreview ?? undefined}
                slotProps={avatarImageSlotProps}
              >
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
                  setSelectedFile(file);
                }}
              />
            </AvatarWrapper>
            {editAvatarPreview && (
              <AvatarDeleteButton
                variant="outlined"
                size="small"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={() => {
                  setEditAvatarPreview(null);
                  setSelectedFile(null);
                  setDeleteImage(true);
                }}
              >
                Remove image
              </AvatarDeleteButton>
            )}
          </AvatarColumnBox>
        </AvatarRow>

        <EditFormBox>
          <EditContentRow>
            <EditFormColumn>
              <Stack direction="row" spacing={2}>
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
              </Stack>

              <Box>
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
              </Box>
            </EditFormColumn>

            <EditColorColumn>
              <BannerColorPicker
                color={bannerColor}
                onChange={setBannerColor}
              />
            </EditColorColumn>
          </EditContentRow>

          <EditActionsRow>
            <SaveButton
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </SaveButton>
            <CancelButton variant="outlined" onClick={onCancel}>
              Cancel
            </CancelButton>
          </EditActionsRow>
        </EditFormBox>
      </ProfileCard>
    </ProfilePage>
  );
};

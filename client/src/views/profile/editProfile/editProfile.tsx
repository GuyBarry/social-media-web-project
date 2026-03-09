import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRef, useState } from "react";
import { BannerColorPicker } from "../../../components/colorPicker/BannerColorPicker";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { FieldLabel } from "../../../components/fieldLabel/FieldLabel.styled";
import { ProfileAvatar } from "../../../components/profileAvatar/ProfileAvatar.styled";
import type { User } from "../../../entities/User";
import { useUpdateUser } from "../../../react/hooks/useUsers";
import {
  AvatarRow,
  ProfileBanner,
  ProfileCard,
  ProfilePage,
} from "../profile.styled";
import { avatarImageSlotProps, resolveBannerColor } from "../profile.utils";
import {
  AvatarCameraOverlay,
  AvatarColumnBox,
  AvatarWrapper,
  EditActionsRow,
  EditColorColumn,
  EditContentRow,
  EditFieldItem,
  EditFieldRow,
  EditFormBox,
  EditFormColumn,
  FieldInput,
} from "./editProfile.styled";

interface EditProfileScreenProps {
  user: User;
  onCancel: () => void;
  onSave: () => void;
}

export const EditProfileScreen = ({
  user,
  onCancel,
  onSave,
}: EditProfileScreenProps) => {
  const { mutateAsync: updateUser } = useUpdateUser();
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

  // if (!user) return null;

  const displayName = user.username;

  const handleSave = async () => {
    const formData = new FormData();

    if (editUsername !== user.username)
      formData.append("username", editUsername);
    if (editBio !== (user.bio ?? "")) formData.append("bio", editBio);
    const existingDate =
      user.birthDate instanceof Date && !isNaN(user.birthDate.getTime())
        ? user.birthDate.toISOString().split("T")[0]
        : "";
    if (editBirthDate && editBirthDate !== existingDate)
      formData.append("birthDate", editBirthDate);
    if (selectedFile) formData.append("image", selectedFile);
    if (deleteImage) formData.append("imageUrl", "");

    const originalBanner = user.bannerColor ?? "1";
    if (bannerColor !== resolveBannerColor(originalBanner))
      formData.append("bannerColor", bannerColor);

    if ([...formData.keys()].length === 0) {
      onSave();
      return;
    }

    await updateUser({ userId: user._id, formData });

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
              <CostumButton
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={() => {
                  setEditAvatarPreview(null);
                  setSelectedFile(null);
                  setDeleteImage(true);
                }}
              >
                Remove image
              </CostumButton>
            )}
          </AvatarColumnBox>
        </AvatarRow>

        <EditFormBox>
          <EditContentRow>
            <EditFormColumn>
              <EditFieldRow direction="row" spacing={2}>
                <EditFieldItem>
                  <FieldLabel>Username</FieldLabel>
                  <FieldInput
                    fullWidth
                    size="small"
                    placeholder="Username"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                </EditFieldItem>

                <EditFieldItem>
                  <FieldLabel>Birth Date</FieldLabel>
                  <FieldInput
                    fullWidth
                    size="small"
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                  />
                </EditFieldItem>
              </EditFieldRow>

              <EditFieldItem>
                <FieldLabel>Description</FieldLabel>
                <FieldInput
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                  placeholder="Tell something about yourself..."
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </EditFieldItem>
            </EditFormColumn>

            <EditColorColumn>
              <BannerColorPicker
                color={bannerColor}
                onChange={setBannerColor}
              />
            </EditColorColumn>
          </EditContentRow>

          <EditActionsRow>
            <CostumButton
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </CostumButton>
            <CostumButton variant="outlined" onClick={onCancel}>
              Cancel
            </CostumButton>
          </EditActionsRow>
        </EditFormBox>
      </ProfileCard>
    </ProfilePage>
  );
};

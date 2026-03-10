import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Typography } from "@mui/material";
import { useRef, useState } from "react";
import { CostumButton } from "../button/CostumButton.styled";
import { ProfileAvatar } from "../profileAvatar/ProfileAvatar.styled";
import { avatarImageSlotProps } from "../../utils/avatar.utils";
import type { User } from "../../entities/User";
import {
  CreatePostActionsRow,
  CreatePostContainer,
  CreatePostInput,
  CreatePostInputRow,
  PhotoButton,
} from "./createPost.styled";

interface CreatePostProps {
  user: User;
  onPost?: (content: string, photo?: File) => void;
}

export const CreatePost = ({ user, onPost }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedPhoto(file);
  };

  const handlePost = () => {
    if (!content.trim() && !selectedPhoto) return;
    onPost?.(content, selectedPhoto ?? undefined);
    setContent("");
    setSelectedPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <CreatePostContainer>
      <CreatePostInputRow>
        <ProfileAvatar
          size={42}
          src={user.imageUrl ?? undefined}
          slotProps={avatarImageSlotProps}
        >
          {user.username.charAt(0).toUpperCase()}
        </ProfileAvatar>
        <CreatePostInput
          placeholder="What's on your mind?"
          multiline
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CreatePostInputRow>

      <CreatePostActionsRow>
        <PhotoButton onClick={handlePhotoClick} role="button">
          <ImageOutlinedIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600} component="span">
            Photo
            {selectedPhoto && ` · ${selectedPhoto.name}`}
          </Typography>
        </PhotoButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <CostumButton
          variant="contained"
          disabled={!content.trim() && !selectedPhoto}
          onClick={handlePost}
        >
          Post
        </CostumButton>
      </CreatePostActionsRow>
    </CreatePostContainer>
  );
};

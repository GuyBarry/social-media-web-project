import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CostumButton } from "../button/CostumButton.styled";
import { ProfileAvatar } from "../profileAvatar/ProfileAvatar.styled";
import { avatarImageSlotProps } from "../../utils/avatar.utils";
import type { User } from "../../entities/User";
import { useCreatePost } from "../../react/hooks/usePosts";
import { ImageCropSelector } from "../imageCropSelector/ImageCropSelector";
import {
  CreatePostActionsRow,
  CreatePostContainer,
  CreatePostInput,
  CreatePostInputRow,
  ContentErrorText,
  ImagePreview,
  ImagePreviewRemoveButton,
  ImagePreviewWrapper,
  PhotoButton,
  PhotoButtonGroup,
  PhotoErrorText,
} from "./createPost.styled";

interface CreatePostProps {
  user: User;
  onPost?: (content: string, photo?: File) => void;
}

export const CreatePost = ({ user, onPost }: CreatePostProps) => {
  const { mutateAsync: createPost } = useCreatePost();
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [contentError, setContentError] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [pendingCropUrl, setPendingCropUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPhoto) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedPhoto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedPhoto]);

  useEffect(() => {
    if (!pendingCropFile) {
      setPendingCropUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingCropFile);
    setPendingCropUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingCropFile]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingCropFile(file);
      setPhotoError(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropConfirm = (croppedFile: File) => {
    setSelectedPhoto(croppedFile);
    setPendingCropFile(null);
    setPhotoError(false);
  };

  const handleCropCancel = () => {
    setPendingCropFile(null);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    const hasContent = content.trim().length > 0;
    const hasPhoto = !!selectedPhoto;

    if (!hasContent) setContentError(true);
    if (!hasPhoto) setPhotoError(true);
    if (!hasContent || !hasPhoto) return;

    await createPost({
      sender: user._id,
      message: content,
      ...(selectedPhoto && { image: selectedPhoto }),
    } as Parameters<typeof createPost>[0]);

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
          error={contentError}
          onChange={(e) => {
            setContent(e.target.value);
            if (e.target.value.trim()) setContentError(false);
          }}
        />
      </CreatePostInputRow>
      {contentError && (
        <ContentErrorText>
          Please add a description to your post.
        </ContentErrorText>
      )}

      {pendingCropUrl && pendingCropFile ? (
        <ImageCropSelector
          previewUrl={pendingCropUrl}
          originalFile={pendingCropFile}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      ) : (
        previewUrl && (
          <ImagePreviewWrapper>
            <ImagePreview src={previewUrl} alt="Selected photo preview" />
            <ImagePreviewRemoveButton size="small" onClick={handleRemovePhoto}>
              <CloseIcon fontSize="small" />
            </ImagePreviewRemoveButton>
          </ImagePreviewWrapper>
        )
      )}

      <CreatePostActionsRow>
        <PhotoButtonGroup>
          <PhotoButton onClick={handlePhotoClick} role="button">
            <ImageOutlinedIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600} component="span">
              Photo
              {selectedPhoto && ` · ${selectedPhoto.name}`}
            </Typography>
          </PhotoButton>
          {photoError && (
            <PhotoErrorText>Please add a photo to your post.</PhotoErrorText>
          )}
        </PhotoButtonGroup>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <CostumButton
          variant="contained"
          disabled={!content.trim() || !selectedPhoto || !!pendingCropFile}
          onClick={handlePost}
        >
          Post
        </CostumButton>
      </CreatePostActionsRow>
    </CreatePostContainer>
  );
};

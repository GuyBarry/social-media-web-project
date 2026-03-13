import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CostumButton } from "../button/CostumButton.styled";
import { ProfileAvatar } from "../profileAvatar/ProfileAvatar.styled";
import { avatarImageSlotProps } from "../../utils/avatar.utils";
import type { User } from "../../entities/User";
import type { Post } from "../../entities/Post";
import { useCreatePost, useUpdatePost } from "../../react/hooks/usePosts";
import { ImageCropSelector } from "../imageCropSelector/ImageCropSelector";
import {
  CreateEditPostActionsRow,
  CreateEditPostContainer,
  CreateEditPostInput,
  CreateEditPostInputRow,
  ContentErrorText,
  ImagePreview,
  ImagePreviewRemoveButton,
  ImagePreviewWrapper,
  PhotoButton,
  PhotoButtonGroup,
  PhotoErrorText,
} from "./createEditPost.styled";

interface CreateEditPostProps {
  user: User;
  initialPost?: Post;
  onSave?: () => void;
}

const CreateEditPost = ({ user, initialPost, onSave }: CreateEditPostProps) => {
  const isEditMode = !!initialPost;
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();
  const [content, setContent] = useState(initialPost?.message ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPost?.imageUrl ?? null,
  );
  const [contentError, setContentError] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [pendingCropUrl, setPendingCropUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;
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
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasImage = !!previewUrl;

  const handleSubmit = async () => {
    const hasContent = content.trim().length > 0;

    if (!hasContent) setContentError(true);
    if (!hasImage) setPhotoError(true);
    if (!hasContent || !hasImage) return;

    if (isEditMode && initialPost) {
      await updatePost({
        id: initialPost._id,
        message: content,
        ...(selectedPhoto && { image: selectedPhoto }),
      });
      onSave?.();
    } else {
      await createPost({
        sender: user._id,
        message: content,
        ...(selectedPhoto && { image: selectedPhoto }),
      } as Parameters<typeof createPost>[0]);

      setContent("");
      setSelectedPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSave?.();
    }
  };

  return (
    <CreateEditPostContainer>
      <CreateEditPostInputRow>
        <ProfileAvatar
          size={42}
          src={user.imageUrl ?? undefined}
          slotProps={avatarImageSlotProps}
        >
          {user.username.charAt(0).toUpperCase()}
        </ProfileAvatar>
        <CreateEditPostInput
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
      </CreateEditPostInputRow>
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

      <CreateEditPostActionsRow>
        <PhotoButtonGroup>
          <PhotoButton onClick={handlePhotoClick} role="button">
            <ImageOutlinedIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600} component="span">
              {previewUrl ? "Change Photo" : "Photo"}
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
          disabled={!content.trim() || !hasImage || !!pendingCropFile}
          onClick={handleSubmit}
        >
          {isEditMode ? "Save" : "Post"}
        </CostumButton>
      </CreateEditPostActionsRow>
    </CreateEditPostContainer>
  );
};

export const CreatePost = ({
  user,
  onSave,
}: Pick<CreateEditPostProps, "user" | "onSave">) => (
  <CreateEditPost user={user} onSave={onSave} />
);

export const EditPost = ({
  user,
  initialPost,
  onSave,
}: Required<CreateEditPostProps>) => (
  <CreateEditPost user={user} initialPost={initialPost} onSave={onSave} />
);

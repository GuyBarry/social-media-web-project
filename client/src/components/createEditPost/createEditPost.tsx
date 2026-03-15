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
  ImagePreview,
  ImagePreviewRemoveButton,
  ImagePreviewWrapper,
  PhotoButton,
} from "./createEditPost.styled";

export interface CreateEditPostProps {
  user: User;
  initialPost?: Post;
  onSave?: () => void;
}

export const CreateEditPost = ({
  user,
  initialPost,
  onSave,
}: CreateEditPostProps) => {
  const isEditMode = !!initialPost;
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();
  const [content, setContent] = useState(initialPost?.message ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPost?.imageUrl ?? null,
  );
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
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropConfirm = (croppedFile: File) => {
    setSelectedPhoto(croppedFile);
    setPendingCropFile(null);
  };

  const handleCropCancel = () => {
    setPendingCropFile(null);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isEditWithoutChanges =
    isEditMode && content === initialPost?.message && !selectedPhoto;
  const isPostUnvalid = !(content.trim() && previewUrl && !pendingCropFile);
  const isSubmitDisabled = isPostUnvalid || isEditWithoutChanges;

  const handleSubmit = async () => {
    if (isEditMode) {
      await updatePost({
        id: initialPost._id,
        ...(content !== initialPost.message && { message: content }),
        ...(selectedPhoto && { image: selectedPhoto }),
      });
      onSave?.();
    } else {
      await createPost({
        sender: user._id,
        message: content,
        image: selectedPhoto!,
      });

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
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </CreateEditPostInputRow>

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
        <PhotoButton onClick={handlePhotoClick} role="button">
          <ImageOutlinedIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600} component="span">
            {previewUrl ? "Change Photo" : "Photo"}
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
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {isEditMode ? "Save" : "Post"}
        </CostumButton>
      </CreateEditPostActionsRow>
    </CreateEditPostContainer>
  );
};

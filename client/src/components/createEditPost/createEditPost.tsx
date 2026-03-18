import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState, type FC } from "react";
import type { Post } from "../../entities/Post";
import type { User } from "../../entities/User";
import { useCreatePost, useUpdatePost } from "../../react/hooks/usePosts";
import { useRewriteWithMood } from "../../react/hooks/useAi";
import { avatarImageSlotProps } from "../../utils/avatar.utils";
import { MOODS, type Mood } from "../../constants/moods";
import { CostumButton } from "../button/CostumButton.styled";
import { ImageCropSelector } from "../imageCropSelector/ImageCropSelector";
import { ProfileAvatar } from "../profileAvatar/ProfileAvatar.styled";
import {
  ActionButtonsContainer,
  CreateEditPostButtonsRow,
  CreateEditPostContainer,
  CreateEditPostInput,
  CreateEditPostInputRow,
  ImagePreview,
  ImagePreviewRemoveButton,
  ImagePreviewWrapper,
  MoodButtonText,
  MoodButtonWrapper,
  MoodButtonsRow,
  MoodLoadingSpinner,
  MoodSuggestionActions,
  MoodSuggestionBox,
  MoodSuggestionText,
  PhotoButton,
} from "./createEditPost.styled";

export interface CreateEditPostProps {
  user: User;
  initialPost?: Post;
  onSave?: () => void;
}

export const CreateEditPost: FC<CreateEditPostProps> = ({
  user,
  initialPost,
  onSave,
}) => {
  const isEditMode = !!initialPost;
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();
  const { mutateAsync: rewriteWithMood, isPending: moodMutationPending } =
    useRewriteWithMood();
  const [content, setContent] = useState(initialPost?.message ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPost?.imageUrl ?? null,
  );
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [pendingCropUrl, setPendingCropUrl] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodSuggestion, setMoodSuggestion] = useState<string | null>(null);

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
    } else {
      await createPost({
        sender: user._id,
        message: content,
        image: selectedPhoto!,
      });

      setContent("");
      setSelectedPhoto(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    onSave?.();
  };

  const handleDiscard = () => {
    if (isEditMode) {
      setContent(initialPost.message);
      setSelectedPhoto(null);
      setPreviewUrl(initialPost.imageUrl);
    } else {
      setContent("");
      setSelectedPhoto(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMoodClick = async (mood: Mood) => {
    if (!content.trim() || moodMutationPending) return;
    if (selectedMood === mood) return;
    setActiveMood(mood);
    setMoodSuggestion(null);
    try {
      const result = await rewriteWithMood({ postContent: content, mood });
      setMoodSuggestion(result);
      setSelectedMood(mood);
    } finally {
      setActiveMood(null);
    }
  };

  const handleAcceptSuggestion = () => {
    if (moodSuggestion) {
      setContent(moodSuggestion);
    }
    setMoodSuggestion(null);
  };

  const handleDiscardSuggestion = () => {
    setMoodSuggestion(null);
    setSelectedMood(null);
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

      <MoodButtonsRow>
        <AutoFixHighIcon fontSize="small" color="primary" />
        {MOODS.map((mood) => (
          <MoodButtonWrapper key={mood} selected={selectedMood === mood}>
            <CostumButton
              size="small"
              variant="outlined"
              disabled={
                moodMutationPending || !content.trim() || selectedMood === mood
              }
              onClick={() => handleMoodClick(mood)}
            >
              {activeMood === mood ? (
                <MoodLoadingSpinner>
                  <CircularProgress size={14} color="inherit" />
                </MoodLoadingSpinner>
              ) : null}
              <MoodButtonText loading={activeMood === mood}>
                {mood}
              </MoodButtonText>
            </CostumButton>
          </MoodButtonWrapper>
        ))}
      </MoodButtonsRow>

      {moodSuggestion && (
        <MoodSuggestionBox>
          <MoodSuggestionText variant="body2">
            {moodSuggestion}
          </MoodSuggestionText>
          <MoodSuggestionActions>
            <CostumButton
              size="small"
              variant="outlined"
              onClick={handleDiscardSuggestion}
            >
              Discard
            </CostumButton>
            <CostumButton
              size="small"
              variant="contained"
              onClick={handleAcceptSuggestion}
            >
              Use this
            </CostumButton>
          </MoodSuggestionActions>
        </MoodSuggestionBox>
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

      <CreateEditPostButtonsRow>
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

        <ActionButtonsContainer>
          <CostumButton variant="outlined" onClick={handleDiscard}>
            {isEditMode ? "Discard Changes" : "Discard"}
          </CostumButton>

          <CostumButton
            variant="contained"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {isEditMode ? "Save" : "Post"}
          </CostumButton>
        </ActionButtonsContainer>
      </CreateEditPostButtonsRow>
    </CreateEditPostContainer>
  );
};

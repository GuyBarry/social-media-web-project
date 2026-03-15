import type { FC } from "react";
import type { Post } from "../../entities/Post";
import type { User } from "../../entities/User";
import { CreateEditPost } from "./createEditPost";

interface EditPostProps {
  user: User;
  initialPost: Post;
  onSave?: () => void;
}

export const EditPost: FC<EditPostProps> = ({ user, initialPost, onSave }) => (
  <CreateEditPost user={user} initialPost={initialPost} onSave={onSave} />
);

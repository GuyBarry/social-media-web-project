import type { FC } from "react";
import type { User } from "../../entities/User";
import { CreateEditPost } from "./createEditPost";

interface CreatePostProps {
  user: User;
  onSave?: () => void;
}

export const CreatePost: FC<CreatePostProps> = ({ user, onSave }) => (
  <CreateEditPost user={user} onSave={onSave} />
);

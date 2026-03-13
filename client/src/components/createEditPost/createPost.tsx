import type { User } from "../../entities/User";
import { CreateEditPost } from "./createEditPost";

interface CreatePostProps {
  user: User;
  onSave?: () => void;
}

export const CreatePost = ({ user, onSave }: CreatePostProps) => (
  <CreateEditPost user={user} onSave={onSave} />
);

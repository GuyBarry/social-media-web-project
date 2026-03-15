import type { Post } from "../../entities/Post";
import type { User } from "../../entities/User";
import { CreateEditPost } from "./createEditPost";

interface EditPostProps {
  user: User;
  initialPost: Post;
  onSave?: () => void;
}

export const EditPost = ({ user, initialPost, onSave }: EditPostProps) => (
  <CreateEditPost user={user} initialPost={initialPost} onSave={onSave} />
);

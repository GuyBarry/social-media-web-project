import { CreateComment } from "../entities/dto/comment.dto";
import { CreatePost } from "../entities/dto/post.dto";
import { CreateUser } from "../entities/dto/user.dto";

export const examplePost: CreatePost = {
  _id: "1234",
  sender: "Mayan",
  message: "Hello, world!",
};

export const exampleComment: CreateComment = {
  _id: "5678",
  postId: "1234",
  sender: "Mayan",
  message: "Nice post!",
};

export const exampleUser: CreateUser = {
  _id: "Mayan",
  username: "mayanamsterdam",
  email: "mayan@example.com",
  birthDate: "2002-10-13",
  bio: "I am the best user ever",
};

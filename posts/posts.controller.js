import express from "express";
import {
  createPostSchema,
  updatePostSchema,
} from "../entities/dto/post.dto.js";
import { validateRequestBody } from "../middlewares/requestBodyValidator.js";
import { postService } from "./posts.service.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  const senderId = req.query.sender;

  const response = senderId
    ? await postService.getPostsBySender(senderId)
    : await postService.getAllPosts();

  res.status(200).send(response);
});

// Get post by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const response = await postService.getPostById(id);

  if (!response) {
    res.status(404).send({
      message: "Post does not exist",
    });
  } else {
    res.status(200).send(response);
  }
});

// Create post
router.post("/", validateRequestBody(createPostSchema), async (req, res) => {
  const postData = req.body;
  const { _id, createdAt } = await postService.createPost(postData);
  res.status(201).send({
    message: "Created new post",
    postId: _id,
    createdAt,
  });
});

// Update post
router.put("/:id", validateRequestBody(updatePostSchema), async (req, res) => {
  const id = req.params.id;
  const postData = req.body;

  const updated = await postService.updatePost(id, postData);

  if (!updated) {
    return res.status(404).send({ message: "Post does not exist", postId: id });
  } else {
    res.status(200).send({
      message: "Updated post",
      postId: id,
      updatedAt: updated.updatedAt,
    });
  }
});

export const postsController = router;

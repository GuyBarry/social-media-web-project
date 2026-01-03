import express from "express";
import postService from "./posts.service.js";
import { createPostSchema } from "../entities/dto/post.dto.js";
import { validateRequestBody } from "../middlewares/requestBodyValidator.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  const response = await postService.getAllPosts();

  res.status(200).send(response);
});

// Create post
router.post("/", validateRequestBody(createPostSchema), async (req, res) => {
  const postData = req.body;
  const { _id, createdAt } = await postService.createPost(postData);
  res.status(201).send({
    message: "created new post",
    postId: _id,
    createdAt,
  });
});

export default router;

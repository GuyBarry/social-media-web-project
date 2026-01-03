import express from "express";
import postService from "./posts.service.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  const response = await postService.getAllPosts();

  res.status(200).send(response);
});

// Create post
router.post("/", async (req, res) => {
  const postData = req.body;
  const { _id, createdAt } = await postService.createPost(postData);
  res.status(201).send({
    message: "created new post",
    postId: _id,
    createdAt,
  });
});

export default router;

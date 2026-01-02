import express from "express";
import { postService } from "./posts.service.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  const response = await postService.getAllPosts();

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

export default router;

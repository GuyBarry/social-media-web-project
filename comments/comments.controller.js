import express from "express";
import { commentsService } from "./comments.service.js";

const router = express.Router();

// Get all comments
router.get("/", async (req, res) => {
  const postId = req.query.postId;

  const response = postId
    ? await commentsService.getAllCommentsByPostId(postId)
    : await commentsService.getAllComments();

  res.status(200).send(response);
});

// Get comment by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await commentsService.getCommentById(id);

  if (!comment) {
    return res.status(404).send({ message: "Comment does not exist" });
  }

  res.status(200).send(comment);
});

export const commentsController = router;

import express from "express";
import { commentsService } from "./comments.service.js";

const router = express.Router();

// Get all comments
router.get("/", async (req, res) => {
  const postID = req.query.postId;

  const response = postID
    ? await commentsService.getAllCommentsByPostId(postID)
    : await commentsService.getAllComments();

  res.status(200).send(response);
});

export const commentsController = router;

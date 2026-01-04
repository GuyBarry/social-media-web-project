import express from "express";
import { commentsService } from "./comments.service.js";
import { validateRequestBody } from "../middlewares/requestBodyValidator.js";
import { commentSchema } from "../entities/dto/comment.dto.js";

const router = express.Router();

// Get all comments
router.get("/", async (req, res) => {
  const postId = req.query.postId;

  const response = postId
    ? await commentsService.getAllCommentsByPostId(postId)
    : await commentsService.getAllComments();

  res.status(200).send(response);
});

// Create comment
router.post("/", validateRequestBody(commentSchema), async (req, res) => {
  const commentData = req.body;
  const { _id, createdAt } = await commentsService.createComment(commentData);

  if (!_id) {
    res.status(400).send({
      message: "Post does not exist",
    });
  } else {
    res.status(201).send({
      message: "created new comment",
      commentId: _id,
      createdAt,
    });
  }
});

export const commentsController = router;

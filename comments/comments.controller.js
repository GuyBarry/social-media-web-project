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

  try {
    const { _id, createdAt } = await commentsService.createComment(commentData);
    res.status(201).send({
      message: "created new comment",
      commentId: _id,
      createdAt,
    });
  } catch (error) {
    if (error.message === "Post does not exist") {
      res.status(400).send({
        message: "Post does not exist",
      });
    } else {
      throw error;
    }
  }
});

export const commentsController = router;

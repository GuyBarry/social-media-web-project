import express from "express";
import { createCommentSchema, updateCommentSchema } from "../entities/dto/comment.dto.js";
import { validateRequestBody } from "../middlewares/requestBodyValidator.js";
import { commentsService } from "./comments.service.js";

const router = express.Router();

// Get all comments
router.get("/", async (req, res) => {
  const { postId } = req.query;

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

// Update comment
router.put(
  "/:id",
  validateRequestBody(updateCommentSchema),
  async (req, res) => {
    const id = req.params.id;
    const commentData = req.body;

    const updated = await commentsService.updateComment(id, commentData);

    if (!updated) {
      res.status(404).send({
        message: "Comment does not exist",
      });
    } else {
      res.status(200).send({
        message: "updated comment",
        commentId: id,
        updatedAt: updated.updatedAt
      });
    }
  }
);

// Create comment
router.post("/", validateRequestBody(createCommentSchema), async (req, res) => {
  const commentData = req.body;

  try {
    const { _id, createdAt } = await commentsService.createComment(commentData);
    res.status(201).send({
      message: "Created new comment",
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

// Delete a comment by Id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deleted = await commentsService.deleteComment(id);

  if (!deleted) {
    return res.status(404).send({ message: "Comment does not exist" });
  }
  
  return res.status(200).send({
    message: "Comment deleted successfully",
  });
});

export const commentsController = router;

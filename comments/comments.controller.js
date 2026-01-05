import express from "express";
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

// Delete a comment by Id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deleted = await commentsService.deleteComment(id);

  if (!deleted) {
    return res.status(500).send({ message: "Error deleting comment" });
  }
  
  return res.status(200).send({
    message: "Comment deleted successfully",
  });
});

export const commentsController = router;

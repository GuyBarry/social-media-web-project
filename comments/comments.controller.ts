import express, { Request, Response } from "express";
import {
  Comment,
  CreateComment,
  createCommentSchema,
  UpdateComment,
  updateCommentSchema,
} from "../entities/dto/comment.dto";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { commentsService } from "./comments.service";

const router = express.Router();
// Get all comments
router.get(
  "/",
  async (
    req: Request<{}, {}, {}, { postId?: Comment["postId"] }>,
    res: Response
  ) => {
    const postId = req.query.postId;

    const response = postId
      ? await commentsService.getAllCommentsByPostId(postId)
      : await commentsService.getAllComments();

    res.status(200).send(response);
  }
);

// Get comment by id
router.get(
  "/:id",
  async (req: Request<{ id: Comment["_id"] }>, res: Response) => {
    const id = req.params.id;
    const comment = await commentsService.getCommentById(id);

    if (!comment) {
      return res.status(404).send({ message: "Comment does not exist" });
    }

    res.status(200).send(comment);
  }
);

// Create comment
router.post(
  "/",
  validateRequestBody(createCommentSchema),
  async (req: Request<{}, {}, CreateComment>, res: Response) => {
    const commentData = req.body;

    try {
      const { _id, createdAt } = await commentsService.createComment(
        commentData
      );
      res.status(201).send({
        message: "Created new comment",
        commentId: _id,
        createdAt,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Post does not exist") {
        res.status(400).send({
          message: "Post does not exist",
        });
      } else {
        throw error;
      }
    }
  }
);

// Update comment
router.put(
  "/:id",
  validateRequestBody(updateCommentSchema),
  async (
    req: Request<{ id: Comment["_id"] }, {}, UpdateComment>,
    res: Response
  ) => {
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
        updatedAt: updated.updatedAt,
      });
    }
  }
);

// Delete a comment by Id
router.delete("/:id", async (req: Request, res: Response) => {
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

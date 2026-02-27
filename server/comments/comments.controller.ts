import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  Comment,
  CreateComment,
  createCommentSchema,
  UpdateComment,
  updateCommentSchema,
} from "../entities/dto/comment.dto";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { validateExistingSender } from "../middlewares/validateExistingUser";
import { commentsService } from "./comments.service";

const router = Router();
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

    res.status(StatusCodes.OK).send(response);
  }
);

// Get comment by id
router.get(
  "/:id",
  async (req: Request<{ id: Comment["_id"] }>, res: Response) => {
    const id = req.params.id;
    const comment = await commentsService.getCommentById(id);

    res.status(StatusCodes.OK).send(comment);
  }
);

// Create comment
router.post(
  "/",
  validateRequestBody(createCommentSchema),
  validateExistingSender,
  async (req: Request<{}, {}, CreateComment>, res: Response) => {
    const commentData = req.body;

    const { _id, createdAt } = await commentsService.createComment(commentData);

    res.status(StatusCodes.CREATED).send({
      message: "Created new comment",
      commentId: _id,
      createdAt,
    });
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

    const { _id, updatedAt } = await commentsService.updateComment(
      id,
      commentData
    );

    res.status(StatusCodes.OK).send({
      message: "updated comment",
      commentId: _id,
      updatedAt: updatedAt,
    });
  }
);

// Delete a comment by Id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await commentsService.deleteComment(id);

  return res.status(StatusCodes.OK).send({
    message: "Comment deleted successfully",
    commentId: id,
  });
});

export const commentsController = router;

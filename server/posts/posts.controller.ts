import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { LikeRequest, likeRequestSchema } from "../entities/dto/like.dto";
import {
  CreatePost,
  createPostSchema,
  Post,
  UpdatePost,
  updatePostSchema,
} from "../entities/dto/post.dto";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { validateExistingSender } from "../middlewares/validateExistingUser";
import { getFileUrl, upload, deleteFile } from "../pictures/pictures.service";
import { likesService } from "./likes/likes.service";
import { postService } from "./posts.service";
import { injectUploadedFileUrl } from "../middlewares/pictureMiddleware";

const router = Router();

// Get all posts
router.get(
  "/",
  async (
    req: Request<{}, {}, {}, { sender?: Post["sender"] }>,
    res: Response,
  ) => {
    const senderId = req.query.sender;

    const response = senderId
      ? await postService.getPostsBySender(senderId)
      : await postService.getAllPosts();

    res.status(StatusCodes.OK).send(response);
  },
);

// Get post by id
router.get("/:id", async (req: Request<{ id: Post["_id"] }>, res: Response) => {
  const id = req.params.id;
  const response = await postService.getPostById(id);

  res.status(StatusCodes.OK).send(response);
});

// Create post
router.post(
  "/",
  upload.single("picture"),
  validateRequestBody(createPostSchema),
  validateExistingSender,
  async (req: Request<{}, {}, CreatePost>, res: Response) => {
    const postData = req.body;

    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "Picture file is required" });
      return;
    }

    postData.picture = getFileUrl(req.file.filename);

    const { _id, createdAt } = await postService.createPost(postData);

    res.status(StatusCodes.CREATED).send({
      message: "Created new post",
      postId: _id,
      createdAt,
    });
  },
);

// Update post
router.put(
  "/:id",
  upload.single("picture"),
  injectUploadedFileUrl,
  validateRequestBody(updatePostSchema),
  async (req: Request<{ id: Post["_id"] }, {}, UpdatePost>, res: Response) => {
    const id = req.params.id;
    const postData = req.body;

    if (req.file) {
      const existingPost = await postService.getPostById(id);
      await deleteFile(existingPost.picture);
    }

    const { _id, updatedAt } = await postService.updatePost(id, postData);

    res.status(StatusCodes.OK).send({
      message: "Updated post",
      postId: _id,
      updatedAt: updatedAt,
    });
  },
);

// Like / Dislike post
router.patch(
  "/:id/like",
  validateRequestBody(likeRequestSchema),
  async (req: Request<{ id: Post["_id"] }, {}, LikeRequest>, res: Response) => {
    const id = req.params.id;
    const userId = req.authUser!._id;
    const { method } = req.body;

    await likesService.handleLike(id, userId, method);

    res.status(StatusCodes.OK).send({
      message: method === "like" ? "Post liked" : "Post disliked",
    });
  },
);

export const postsController = router;

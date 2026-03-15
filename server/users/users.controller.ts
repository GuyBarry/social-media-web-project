import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateGoogleUser,
  CreateUser,
  createUserSchema,
  UpdateUser,
  updateUserSchema,
  User,
} from "../entities/dto/user.dto";
import { injectUploadedUrl } from "../middlewares/pictureMiddleware";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { pictureService } from "../pictures/pictures.service";
import { usersService } from "./users.service";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  res.status(StatusCodes.OK).send(users);
});

// Get user by id
router.get("/:id", async (req: Request<{ id: User["_id"] }>, res: Response) => {
  const { id } = req.params;
  const user = await usersService.getUserById(id);

  res.status(StatusCodes.OK).send(user);
});

// Create user
router.post(
  "/",
  validateRequestBody(createUserSchema),
  async (
    req: Request<{}, {}, CreateUser | CreateGoogleUser>,
    res: Response
  ) => {
    try {
      const user = await usersService.createUser(req.body);

      res.status(StatusCodes.CREATED).send({
        message: "Created new user",
        userId: user._id,
        createdAt: user.createdAt,
      });
    } catch (error) {
      // Handle duplicate key error (MongoDB code 11000)
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return res
          .status(StatusCodes.CONFLICT)
          .send({ message: "User already exists" });
      }
      throw error;
    }
  }
);

// Update user
router.put(
  "/:id",
  pictureService.upload.single("image"),
  injectUploadedUrl("imageUrl"),
  validateRequestBody(updateUserSchema),
  async (req: Request<{ id: User["_id"] }, {}, UpdateUser>, res: Response) => {
    const { id } = req.params;
    try {
      if (req.file) {
        const existingUser = await usersService.getUserById(id);
        if (existingUser.imageUrl) {
          await pictureService.deleteFile(existingUser.imageUrl);
        }
      } else if (req.body.imageUrl === "") {
        const existingUser = await usersService.getUserById(id);
        if (existingUser.imageUrl) {
          await pictureService.deleteFile(existingUser.imageUrl);
        }
      }

      const user = await usersService.updateUser(id, req.body);

      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return res
          .status(StatusCodes.CONFLICT)
          .send({ message: "User already exists" });
      }
      throw error;
    }
  }
);

// Delete user
router.delete(
  "/:id",
  async (req: Request<{ id: User["_id"] }>, res: Response) => {
    const { id } = req.params;
    await usersService.deleteUser(id);

    res
      .status(StatusCodes.OK)
      .send({ message: "User deleted successfully", userId: id });
  }
);

export const usersController = router;

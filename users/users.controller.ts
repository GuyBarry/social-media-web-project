import { Request, Response, Router } from "express";
import {
  CreateUser,
  createUserSchema,
  UpdateUser,
  updateUserSchema,
  User,
} from "../entities/dto/user.dto";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { usersService } from "./users.service";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  res.status(200).send(users);
});

// Get user by id
router.get("/:id", async (req: Request<{ id: User["_id"] }>, res: Response) => {
  const { id } = req.params;
  const user = await usersService.getUserById(id);

  if (!user) {
    return res.status(404).send({ message: "User does not exist" });
  }

  res.status(200).send(user);
});

// Create user
router.post(
  "/",
  validateRequestBody(createUserSchema),
  async (req: Request<{}, {}, CreateUser>, res: Response) => {
    try {
      const user = await usersService.createUser(req.body);
      res.status(201).send({
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
        return res.status(409).send({ message: "User already exists" });
      }
      throw error;
    }
  }
);

// Update user
router.put(
  "/:id",
  validateRequestBody(updateUserSchema),
  async (req: Request<{ id: User["_id"] }, {}, UpdateUser>, res: Response) => {
    const { id } = req.params;

    const user = await usersService.updateUser(id, req.body);

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    res.status(200).send(user);
  }
);

// Delete user
router.delete(
  "/:id",
  async (req: Request<{ id: User["_id"] }>, res: Response) => {
    const { id } = req.params;
    const deleted = await usersService.deleteUser(id);

    if (!deleted) {
      return res.status(404).send({ message: "User does not exist" });
    }

    res.status(200).send({ message: "User deleted successfully", userId: id });
  }
);

export const usersController = router;

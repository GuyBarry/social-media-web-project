import { NextFunction, Request, Response } from "express";
import { UserModel } from "../entities/mongodb/user.module";
import { NotFoundException } from "../exceptions/notFoundException";
import { UnauthorizedException } from "../exceptions/unauthorizedException";

export const validateExistingSender = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { sender: senderId } = req.body;

    if (!senderId) {
      next();
    }

    const user = await UserModel.findById(senderId);
    if (!user) {
      throw new NotFoundException("User", { id: senderId });
    }

    if (senderId !== req.userId) {
      throw new UnauthorizedException(
        "Sender does not match authenticated user"
      );
    }

    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    throw error;
  }
};

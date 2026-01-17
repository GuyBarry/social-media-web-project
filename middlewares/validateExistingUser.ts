import { NextFunction, Request, Response } from "express";
import { UserModel } from "../entities/mongodb/user.module";
import { NotFoundException } from "../exceptions/notFoundException";

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

    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    throw error;
  }
};

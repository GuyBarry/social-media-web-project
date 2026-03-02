import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { validateExistingSender } from "../middlewares/validateExistingUser";
import { generateAIContent } from "./ai.service";

const router = Router();

// Generate AI content from a description
router.get(
  "/generate",
  validateExistingSender,
  async (req: Request<{}, {}, { sender: string; description: string }>, res: Response) => {
    const { description } = req.body;

    const result = await generateAIContent(description);

    res.status(StatusCodes.OK).send({ content: result });
  },
);

export const aiController = router;

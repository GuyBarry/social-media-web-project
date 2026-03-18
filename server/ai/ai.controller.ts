import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { MoodRequest, moodRequestSchema } from "../entities/dto/mood.dto";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { rewriteWithMood } from "./prompt.manager";

const router = Router();

router.post(
  "/mood",
  validateRequestBody(moodRequestSchema),
  async (req: Request<{}, { result: string }, MoodRequest>, res: Response) => {
    const { postContent, mood } = req.body;

    const result = await rewriteWithMood(postContent, mood);

    res.status(StatusCodes.OK).send({ result });
  },
);

export const aiController = router;

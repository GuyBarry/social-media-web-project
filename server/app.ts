import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import mongoose from "mongoose";
import passport from "passport";
import { authController } from "./auth/auth.contoller";
import { commentsController } from "./comments/comments.controller";
import { dbConfig } from "./config/db.config";
import { serverConfig } from "./config/server.config";
import { validateAccessToken } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";
import { noRouteHandler } from "./middlewares/noRouteHandler";
import { postsController } from "./posts/posts.controller";
import { registerSwagger } from "./swagger/setupSwagger";
import { usersController } from "./users/users.controller";

export const initApp = async (): Promise<Express> => {
  const port = serverConfig.port;
  const app = express();
  app.use(
    cors({
      origin: serverConfig.clientUrl,
      credentials: true,
    })
  );

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  require("./auth/auth.google");

  app.use("/posts", validateAccessToken, postsController);
  app.use("/comments", validateAccessToken, commentsController);
  app.use("/users", validateAccessToken, usersController);
  app.use("/auth", authController);

  registerSwagger(app);
  app.use(noRouteHandler);
  app.use(errorHandler);

  try {
    mongoose.connection.on("open", () => console.log("Connected to mongoDB"));
    mongoose.connection.on("error", (error) => console.error(error));
    await mongoose.connect(dbConfig.connectionUrl);

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    const error = err as Error;
    const errorLog = {
      message: error.message,
      stack: error.stack,
    };

    console.error(errorLog);
  }

  return app;
};

void initApp();

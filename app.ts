import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import { dbConfig } from "./config/db.config";
import { serverConfig } from "./config/server.config";
import { errorHandler } from "./middlewares/errorHandler";
import { noRouteHandler } from "./middlewares/noRouteHandler";
import { postsController } from "./posts/posts.controller";
import { commentsController } from "./comments/comments.controller";
import { usersController } from "./users/users.controller";
import { registerSwagger } from "./swagger/setupSwagger";

export const initApp = async (): Promise<Express> => {
  const port = serverConfig.port;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());

  app.use("/posts", postsController);
  app.use("/comments", commentsController);
  app.use("/users", usersController);

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

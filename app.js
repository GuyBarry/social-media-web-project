import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import dbConfig from "./config/db.config.js";
import serverConfig from "./config/server.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { noRouteHandler } from "./middlewares/noRouteHandler.js";
import { postsController } from "./posts/posts.controller.js";

export const initApp = async () => {
  const port = serverConfig.port;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());

  app.use("/posts", postsController);
  app.use(noRouteHandler);
  app.use(errorHandler);

  try {
    mongoose.connection.on("open", () => console.log("Connected to mongoDB"));
    mongoose.connection.on("error", (error) => console.error(error));
    await mongoose.connect(dbConfig.connectionUrl);

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
    };

    console.error(errorLog);
  }

  return app;
};

initApp();

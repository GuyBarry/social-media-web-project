import express from "express";
import bodyParser from "body-parser";
import postsController from "./controllers/posts.controller.js";
import serverConfig from "./config/server.config.js";
import dbConfig from "./config/db.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import mongoose from "mongoose";

const main = async () => {
  const port = serverConfig.port;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());

  app.use("/posts", postsController);
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
};

main();

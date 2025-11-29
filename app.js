import express from "express";
import bodyParser from "body-parser";
import postsController from "./controllers/posts.controller.js";
import serverConfig from "./config/server.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const main = async () => {
  const port = serverConfig.port;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());
  
  app.use("/posts", postsController);
  app.use(errorHandler);

  try {
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

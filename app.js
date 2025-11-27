import bodyParser from "body-parser";
import postsController from "./controllers/posts.controller";
import serverConfig from "./config/server.config";
import { errorHandler } from "./middlewares/errorHandler";

const main = async () => {
  const port = serverConfig.port;
  const app = express();

  //middleware
  app.use(bodyParser.json());
  app.use(errorHandler);

  //endpoints
  app.use("/posts", postsController);

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

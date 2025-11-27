import bodyParser from "body-parser";
import postsController from "./controllers/posts.controller";
import serverConfig from "./config/server.config";

const main = async () => {
  const port = serverConfig.port;
  const app = express();
  app.use(bodyParser.json());
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

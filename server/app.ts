import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import fs from "fs";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import { aiController } from "./ai/ai.controller";
import { authController } from "./auth/auth.contoller";
import { commentsController } from "./comments/comments.controller";
import { dbConfig } from "./config/db.config";
import { serverConfig } from "./config/server.config";
import { ExpirationInSec } from "./entities/dto/auth.dto";
import { validateAccessToken } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";
import { noRouteHandler } from "./middlewares/noRouteHandler";
import { setUpRateLimit } from "./middlewares/rateLimiter";
import { postsController } from "./posts/posts.controller";
import { registerSwagger } from "./swagger/setupSwagger";
import { trendingController } from "./trending/trending.controller";
import { usersController } from "./users/users.controller";

export const initApp = async (): Promise<Express> => {
  const port = serverConfig.port;
  const app = express();
  app.use(
    cors({
      origin: serverConfig.clientUrl,
      credentials: true,
    }),
  );

  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  require("./auth/auth.google");

  app.use("/public", express.static(path.resolve(__dirname, "public")));

  app.use("/posts", validateAccessToken, postsController);
  app.use("/comments", validateAccessToken, commentsController);
  app.use("/users", validateAccessToken, usersController);
  app.use("/auth", authController);
  app.use("/trending", validateAccessToken, trendingController);
  app.use(
    "/ai",
    setUpRateLimit({ limit: 10, windowMs: ExpirationInSec.ONE_MINUTE * 1000 }),
    validateAccessToken,
    aiController,
  );

  registerSwagger(app);
  app.use(noRouteHandler);
  app.use(errorHandler);

  try {
    mongoose.connection.on("open", () => console.log("Connected to mongoDB"));
    mongoose.connection.on("error", (error) => console.error(error));
    await mongoose.connect(dbConfig.connectionUrl);

    if (serverConfig.env === "production") {
      const privateKey = fs.readFileSync(
        path.resolve(__dirname, "certs/key.pem"),
        "utf8",
      );
      const certificate = fs.readFileSync(
        path.resolve(__dirname, "certs/cert.pem"),
        "utf8",
      );
      const credentials = { key: privateKey, cert: certificate };

      https.createServer(credentials, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    } else {
      http.createServer(app).listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    }
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

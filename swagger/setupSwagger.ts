import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const apiSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
    },
  },
  tags: [{ name: "Posts" }, { name: "Comments" }],
  apis: ["**/*.controller.ts", "**/*.dto.ts"],
});

export const registerSwagger = (app: Express) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(apiSpec, {
      swaggerOptions: {
        operationsSorter: "method",
      },
    })
  );
};

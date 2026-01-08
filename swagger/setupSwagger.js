import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const apiSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
    },
  },
  tags: [{ name: "Posts" }, { name: "Comments" }],
  apis: ["**/*.controller.docs.js", "**/*.dto.js"],
});

export const setupSwagger = [
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, {
    swaggerOptions: {
      operationsSorter: "method",
    },
  }),
];

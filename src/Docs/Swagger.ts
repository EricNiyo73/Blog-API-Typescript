import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const router = express.Router();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API documentation for the Blog application",
      contact: {
        name: "Mr Eric",
        email: "ericnemachie@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          scheme: "bearer",
          name: "Authorization",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/Docs/*.ts"],
};

const specs = swaggerJSDoc(options);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(specs));

export default router;

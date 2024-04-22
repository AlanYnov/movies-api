const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Movies API",
      version: "1.0.0",
      description:
        "This project responds to the practical work to be carried out as part of the Web services course in master 2.",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Enter your bearer token in the format 'Bearer {token}'",
        },
      },
      schemas: {
        Movie: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            release_date: { type: "string", format: "date-time" },
            image_path: { type: "string" },
            rating: { type: "number" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            category_id: { type: "integer" },
          },
          required: ["id", "title", "release_date", "category_id"],
        },
        MovieInput: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            release_date: { type: "string", format: "date-time" },
            image_path: { type: "string" },
            rating: { type: "number" },
            category_id: { type: "integer" },
          },
          required: [
            "title",
            "description",
            "release_date",
            "image_path",
            "rating",
            "category_id",
          ],
        },
      },
    },
  },
  apis: ["./api/routes/*.js"],
};

const specs = swaggerJsdoc(options);

console.log(specs);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

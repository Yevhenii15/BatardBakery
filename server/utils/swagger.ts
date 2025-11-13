import swaggerJSDoc from "swagger-jsdoc";
import { join } from "path";

// Use project root so paths work in Nuxt/Nitro
const apisGlob = join(process.cwd(), "server/api/**/*.ts");

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Batard Bakery API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        HeroSection: {
          type: "object",
          required: ["title"],
          additionalProperties: false,
          properties: {
            title: { type: "string", example: "Bageri i Vejers Strand" },
            subTitle: {
              type: "string",
              example:
                "Batard Bakery er det bedste surdejsbageri i Vejers Strand",
            },
            heroImg1: { type: "string", example: "/images/hero1.jpg" },
            heroImg2: { type: "string", example: "/images/hero2.jpg" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            email: { type: "string", example: "admin@batard.dk" },
            passwordHash: { type: "string", readOnly: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@batard.dk" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/Admin" },
          },
        },
      },
      responses: {
        NotFound: { description: "Not found" },
      },
    },
    servers: [{ url: "/" }],
  },
  apis: [apisGlob],
});

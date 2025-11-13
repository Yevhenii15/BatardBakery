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
      },
      responses: {
        NotFound: { description: "Not found" },
      },
    },
    servers: [{ url: "/" }],
  },
  apis: [apisGlob],
});

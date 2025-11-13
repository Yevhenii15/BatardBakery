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
        Company: {
          type: "object",
          required: ["shortDescription", "description"],
          properties: {
            shortDescription: {
              type: "string",
              example: "Ideen til Batard Bakery startede for mange år siden!",
            },
            description: {
              type: "string",
              example:
                "Batard Bakery er en passioneret og innovativ bagerivirksomhed med dybe rødder i fødevarebranchen, især inden for bageribranchen. Grundlagt af en erfaren gruppe fagfolk, der har arbejdet inden for fødevareindustrien i mange år, bringer vi ekspertise og kærlighed til håndværket til hver eneste brød og kage, vi bager.",
            },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        ContactInfo: {
          type: "object",
          required: ["email", "phone", "address"],
          properties: {
            email: { type: "string", example: "hello@batardbakery.dk" },
            phone: { type: "string", example: "+45 29 25 03 80" },
            openingHours: {
              type: "string",
              example: "Mon–Fri 08:00–17:00, Sat 09:00–13:00",
            },
            address: {
              type: "string",
              example: "Vejers Havvej 81B 6853 Vejers Strand",
            },
            logo: { type: "string", example: "/images/logo.svg" },
            cvr: { type: "string", example: "43368532" },
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

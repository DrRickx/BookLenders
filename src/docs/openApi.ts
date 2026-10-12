import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { loginSchema, registerSchema } from "../schema/auth.schema";
import {
  listBooksQuerySchema,
  bookResponseSchema,
  createBookSchema,
  updateBookSchema,
} from "../schema/book.schema";
import { idParamSchema } from "../schema/common.schema";
import { createLoanSchema } from "../schema/loan.schema";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const secured = [{ bearerAuth: [] }];

const jsonBody = (schema: z.ZodTypeAny) => ({
  required: true,
  content: { "application/json": { schema } },
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Create a member account",
  request: {
    body: jsonBody(registerSchema),
  },
  responses: {
    201: { description: "Account created; returns the member and a JWT" },
    400: { description: "Validation error" },
    409: { description: "Email already registered" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login and receive a JWT",
  request: {
    body: jsonBody(loginSchema),
  },
  responses: {
    200: { description: "Returns the member and a JWT" },
    401: { description: "Invalid email or password" },
  },
});

registry.registerPath({
  method: "get",
  path: "/books",
  tags: ["Books"],
  summary: "List books (supports search and pagination)",
  request: { query: listBooksQuerySchema },
  responses: {
    200: {
      description: "A page of books",
      content: { "application/json": { schema: z.array(bookResponseSchema) } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/books/{id}",
  tags: ["Books"],
  summary: "Get one book",
  request: { params: idParamSchema },
  responses: {
    200: {
      description: "The book",
      content: { "application/json": { schema: bookResponseSchema } },
    },
    404: { description: "Book not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/books",
  tags: ["Books"],
  summary: "Add a book (librarian only)",
  security: secured,
  request: { body: jsonBody(createBookSchema) },
  responses: {
    201: {
      description: "Book created",
      content: { "application/json": { schema: bookResponseSchema } },
    },
    400: { description: "Validation error" },
    401: { description: "Not logged in" },
    403: { description: "Not a librarian" },
    409: { description: "ISBN already exists" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/books/{id}",
  tags: ["Books"],
  summary: "Update a book (librarian only)",
  security: secured,
  request: { params: idParamSchema, body: jsonBody(updateBookSchema) },
  responses: {
    200: { description: "Updated book" },
    404: { description: "Book not found" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/books/{id}",
  tags: ["Books"],
  summary: "Delete a book (librarian only)",
  security: secured,
  request: { params: idParamSchema },
  responses: {
    204: { description: "Deleted" },
    404: { description: "Book not found" },
  },
});

// --- Loans ---
registry.registerPath({
  method: "get",
  path: "/loans/me",
  tags: ["Loans"],
  summary: "List my loans",
  security: secured,
  responses: { 200: { description: "The caller's loans, newest first" } },
});

registry.registerPath({
  method: "post",
  path: "/loans",
  tags: ["Loans"],
  summary: "Borrow a book",
  security: secured,
  request: { body: jsonBody(createLoanSchema) },
  responses: {
    201: { description: "Loan created" },
    404: { description: "Book not found" },
    409: { description: "No copies available, or loan limit reached" },
  },
});

registry.registerPath({
  method: "post",
  path: "/loans/{id}/return",
  tags: ["Loans"],
  summary: "Return a book",
  security: secured,
  request: { params: idParamSchema },
  responses: {
    200: { description: "Loan closed; includes any overdue fee" },
    403: { description: "Not your loan" },
    404: { description: "Loan not found" },
    409: { description: "Already returned" },
  },
});

export const openApiDocument = new OpenApiGeneratorV3(
  registry.definitions,
).generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Library API",
    version: "1.0.0",
    description:
      "REST API for a book lending library: members, books, loans, reservations.",
  },
  servers: [{ url: "/api" }],
});

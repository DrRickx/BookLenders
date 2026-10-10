import { Router } from "express";
import * as bookService from "../services/book.services";
import {
  createBookSchema,
  listBooksQuerySchema,
  updateBookSchema,
} from "../schema/book.schema";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema } from "../schema/common.schema";
import { requireAuth, requireRole } from "../middleware/auth";

export const bookRouter = Router();

bookRouter.get(
  "/",
  validate(listBooksQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    res.json(await bookService.listBooks(req.query as never));
  }),
);

bookRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(async (req, res) => {
    res.json(await bookService.getBook(req.params.id as string));
  }),
);

bookRouter.post(
  "/",
  requireAuth,
  requireRole("librarian"),
  validate(createBookSchema),
  asyncHandler(async (req, res) => {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  }),
);

bookRouter.patch(
  "/:id",
  requireAuth,
  requireRole("librarian"),
  validate(idParamSchema, "params"),
  validate(updateBookSchema),
  asyncHandler(async (req, res) => {
    res.json(await bookService.updateBook(req.params.id as string, req.body));
  }),
);

bookRouter.delete(
  "/:id",
  requireAuth,
  requireRole("librarian"),
  validate(idParamSchema, "params"),
  asyncHandler(async (req, res) => {
    await bookService.deleteBook(req.params.id as string);
    res.status(204).end();
  }),
);

import { desc, ilike, or, eq } from "drizzle-orm";
import type {
  CreateBookInput,
  ListBooksQuery,
  UpdateBookInput,
} from "../schema/book.schema";
import { books } from "../db/schema";
import { db } from "../db/client";
import { ConflictError, NotFoundError } from "../utils/error";
import { input } from "zod";

// List all the books
export const listBooks = async (query: ListBooksQuery) => {
  const where = query.search
    ? or(
        ilike(books.title, `%${query.search}%`),
        ilike(books.author, `%${query.search}%`),
      )
    : undefined;

  return db
    .select()
    .from(books)
    .where(where)
    .orderBy(desc(books.createdAt))
    .limit(query.limit)
    .offset(query.offset);
};

// Get specific book using ID
export const getBook = async (id: string) => {
  const book = await db.select().from(books).where(eq(books.id, id));
  if (!book) throw new NotFoundError("Book does not exist");
  return book;
};

// Create Book
export const createBook = async (input: CreateBookInput) => {
  // check if there is duplicate book
  const [duplicate] = await db
    .select()
    .from(books)
    .where(eq(books.isbn, input.isbn));
  if (duplicate)
    throw new ConflictError("A book with this ISBN already exists");

  //   Create book
  const [book] = await db
    .insert(books)
    .values({
      ...input,
      publishedDate: new Date(input.publishedDate),
      copiesAvailable: input.copiesTotal,
    })
    .returning();
  if (!book) throw new Error("Failed to create book");
  return book;
};

// Update book
export const updateBook = async (id: string, input: UpdateBookInput) => {
  const [book] = await db
    .update(books)
    .set({
      ...input,
      publishedDate:
        input.publishedDate === undefined
          ? undefined
          : new Date(input.publishedDate),
    })
    .where(eq(books.id, id))
    .returning();
  if (!book) throw new NotFoundError("Book");
  return book;
};

export const deleteBook = async (id: string) => {
  const [book] = await db.delete(books).where(eq(books.id, id)).returning({
    id: books.id,
  });
  if (!book) throw new NotFoundError("Book");
};

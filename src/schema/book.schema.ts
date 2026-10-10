import z from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1).max(300),
  author: z.string().min(1).max(200),
  isbn: z.string().length(13, "ISBN-13 must be exactly 13 characters"),
  copiesTotal: z.number().int().min(1).default(1),
  publishedDate: z.string().datetime(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema
  .omit({ copiesTotal: true })
  .partial();

export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export const listBooksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().min(1).optional(),
});

export type ListBooksQuery = z.infer<typeof listBooksQuerySchema>;

// Book Response for OpenApi
export const bookResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string,
  isbn: z.string(),
  copiesTotal: z.number().int(),
  copiesAvailable: z.number().int(),
  createdAt: z.string().datetime(),
});

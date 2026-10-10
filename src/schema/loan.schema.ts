import { z } from "zod";

export const createLoanSchema = z.object({
  bookId: z.string().max(36),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

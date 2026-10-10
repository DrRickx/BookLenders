import { db } from "../db/client";
import { books, loans, type Role } from "../db/schema";
import { and, count, eq, gt, isNull, sql } from "drizzle-orm";
import {
  calculateDue,
  calculateOverdueFees,
  MAX_ACTIVE_LOANS,
} from "./loan.rules";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/error";

export const borrowBook = async (memberId: string, bookId: string) => {
  return db.transaction(async (tx) => {
    // Check if the user has already maxed their loan
    const [active] = await tx
      .select({ value: count() })
      .from(loans)
      .where(and(eq(loans.memberId, memberId), isNull(loans.returnedAt)));
    if ((active?.value ?? 0) >= MAX_ACTIVE_LOANS) {
      throw new ConflictError(
        `Loan limit reached (${MAX_ACTIVE_LOANS} books at a time)`,
      );
    }

    // Decrement the total available books in the storage
    const [book] = await tx
      .update(books)
      .set({ copiesAvailable: sql`${books.copiesAvailable}-1` })
      .where(and(eq(books.id, bookId), gt(books.copiesAvailable, 0)))
      .returning();

    if (!book) {
      const [exists] = await db
        .select()
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1);
      if (exists) throw new NotFoundError("Book does not exists");
      throw new ConflictError("No copies available");
    }

    const borrowedAt = new Date();

    const [loan] = await tx
      .insert(loans)
      .values({
        memberId,
        bookId,
        borrowedAt,
        dueAt: calculateDue(borrowedAt),
      })
      .returning();
    if (!loan) throw new Error("Failed to create loan");
    return loan;
  });
};

export const returnLoan = async (
  loanId: string,
  requestor: { id: string; role: Role },
) => {
  return db.transaction(async (tx) => {
    const [loan] = await tx.select().from(loans).where(eq(loans.id, loanId));
    if (!loan) throw new NotFoundError("Loan");
    if (loan.memberId !== requestor.id && requestor.role === "librarian") {
      throw new ForbiddenError();
    }
    if (loan.returnedAt) throw new ConflictError("Book already returned");

    const returnedAt = new Date();

    const [updated] = await tx
      .update(loans)
      .set({
        returnedAt,
      })
      .where(eq(loans.id, loanId))
      .returning();

    await tx.update(books).set({
      copiesAvailable: sql`${books.copiesAvailable} + 1`,
    });

    return {
      loan: updated,
      overdueFee: calculateOverdueFees(loan.dueAt, returnedAt),
    };
  });
};

export const listLoanForMembers = async (id: string) => {
  return db
    .select()
    .from(loans)
    .where(eq(loans.memberId, id))
    .orderBy(loans.dueAt);
};

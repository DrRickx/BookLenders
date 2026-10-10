export const MAX_ACTIVE_LOANS = 5;
export const LOAN_PERIOD_DAYS = 14;
export const OVERDUE_FEE_PER_DAY = 0.25;

const MS_PER_DAY = 86_400_000;

export function calculateDue(borrowedAt: Date, days = LOAN_PERIOD_DAYS): Date {
  return new Date(borrowedAt.getTime() + days * MS_PER_DAY);
}

export function calculateOverdueFees(dueAt: Date, returnedAt: Date): number {
  if (dueAt <= returnedAt) return 0;
  const daysLate = Math.ceil(
    (returnedAt.getTime() - dueAt.getTime()) / MS_PER_DAY,
  );
  return Math.round(daysLate * OVERDUE_FEE_PER_DAY * 100) / 100;
}

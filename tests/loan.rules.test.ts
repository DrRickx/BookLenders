import { describe, expect, it } from "vitest";
import {
  LOAN_PERIOD_DAYS,
  calculateDue,
  calculateOverdueFees,
} from "../src/services/loan.rules";

describe("calculateDueDate", async () => {
  it("adds the default loan period", async () => {
    const borrowed = new Date("2026-01-01T00:00:00Z");
    const due = calculateDue(borrowed);

    expect(due.toISOString()).toBe("2026-01-15T00:00:00.000Z");
    expect(LOAN_PERIOD_DAYS).toBe(14);
  });
});

describe("calculateOverDueFees", async () => {
  const due = new Date("2026-01-15T00:00:00Z");

  it("is zero when returned on time", () => {
    expect(calculateOverdueFees(due, new Date("2026-01-14T00:00:00Z"))).toBe(0);
    expect(calculateOverdueFees(due, due)).toBe(0);
  });

  it("charges per day late", () => {
    expect(calculateOverdueFees(due, new Date("2026-01-18T00:00:00Z"))).toBe(
      0.75,
    );
  });

  it("counts a partly-late day as a full day", () => {
    expect(calculateOverdueFees(due, new Date("2026-01-15T06:00:00Z"))).toBe(
      0.25,
    );
  });
});

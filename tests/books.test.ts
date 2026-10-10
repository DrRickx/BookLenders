import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import * as bookService from "../src/services/book.services";
import { tokenFor } from "./helpers/token";

// Set the mock service to test the layers without db
vi.mock("../src/services/book.services.ts");

// Create a sample book to use in tests
const sampleBook = {
  id: "01a1261c-9ac4-70e9-892f-c66d61870e51",
  title: "1984",
  author: "George Orwell",
  isbn: "9780451524935",
  copiesTotal: 1,
  copiesAvailable: 1,
  publishedDate: new Date("2026-01-01T00:00:00Z"),
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

// Create token for each mock users
const librarianToken = tokenFor(
  "01a1261e-1c31-729a-9d31-6294e8d8a4a8",
  "librarian",
);

const memberToken = tokenFor("01a1261e-db37-73b1-a49e-5e302bff8526", "member");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("/GET /api/books", async () => {
  // List all the books by defaul
  it("list all books without authentication", async () => {
    vi.mocked(bookService.listBooks).mockResolvedValue([sampleBook]);

    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toEqual("1984");
  });

  //   With pagination results
  it("applies pagination defaults from query schema", async () => {
    vi.mocked(bookService.listBooks).mockResolvedValue([sampleBook]);
    await request(app).get("/api/books");
    expect(bookService.listBooks).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
  });

  //   With limit results
  it("reject an invalid limit", async () => {
    const res = await request(app).get("/api/books?limit=1000");
    expect(res.status).toBe(400);
  });
});

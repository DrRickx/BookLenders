import { datetime } from "drizzle-orm/mssql-core";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const roleEnum = pgEnum("role", ["member", "librarian"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const members = pgTable("members", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export const books = pgTable("books", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar("name", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  isbn: varchar("isbn", { length: 13 }).notNull().unique(),
  publishedDate: datetime("published_date").notNull(),
  copiesTotal: integer("copies_total").notNull().default(1),
  copiesAvailable: integer("copies_available").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

export const loans = pgTable("loans", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  borrowedAt: timestamp("borrowed_at").notNull().defaultNow(),
  dueAt: timestamp("due_at").notNull(),
  returnedAt: timestamp("returned_at"),
});

export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;

export const reservations = pgTable("reservations", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fulfilledAt: timestamp("fulfilled_at"),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

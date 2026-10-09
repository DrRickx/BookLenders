import { env } from "../config/env";
import jwt from "jsonwebtoken";
import { members, type Role } from "../db/schema";
import type { LoginInput, RegisterInput } from "../schema/auth.schema";
import { db } from "../db/client";
import { eq } from "drizzle-orm";
import { ConflictError, UnauthorizedError } from "../utils/error";
import bcrypt from "bcryptjs";

function signToken(member: { id: string; role: Role }): string {
  return jwt.sign({ role: member.role }, env.JWT_SECRET, {
    subject: String(member.id),
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>,
  });
}

export const register = async (input: RegisterInput) => {
  const [existing] = await db
    .select()
    .from(members)
    .where(eq(members.email, input.email));

  if (existing) throw new ConflictError("Email already exists");

  const passwordHash = await bcrypt.hash(input.password, env.SALT_ROUNDS);

  const [member] = await db
    .insert(members)
    .values({
      email: input.email,
      firstName: input.first_name,
      lastName: input.last_name,
      middleName: input.middle_name,
      passwordHash,
    })
    .returning();
  if (!member) throw new Error("Failed to create member");

  return {
    member: {
      id: member.id,
      email: member.email,
    },
    token: signToken(member),
  };
};

export const login = async (input: LoginInput) => {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, input.email))
    .limit(1);

  const valid =
    member && (await bcrypt.compare(input.password, member.passwordHash));
  if (!member || !valid)
    throw new UnauthorizedError("Invalid email or password");

  return {
    token: signToken(member),
  };
};

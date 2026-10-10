import type { RequestHandler } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/error";
import { env } from "../config/env";
import jwt from "jsonwebtoken";
import type { Role } from "../db/schema.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer")) {
    throw new UnauthorizedError("Missing bearer token");
  }

  try {
    const payload = jwt.verify(
      header.slice("Bearer ".length),
      env.JWT_SECRET as string,
    );
    if (typeof payload === "string" || !payload.sub)
      throw new Error("Bad payload");
    req.user = {
      id: String(payload.sub),
      role: payload["role"] as Role,
    };
  } catch {
    throw new UnauthorizedError("Invalid bearer token");
  }

  next();
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  };

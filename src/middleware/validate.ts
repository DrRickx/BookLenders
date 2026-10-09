import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

type Source = "body" | "params" | "query";

// Validates req.body / req.params / req.query against a Zod schema.
// On success the parsed (and coerced / defaulted) data replaces the original.
export const validate =
  (schema: ZodTypeAny, source: Source = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "ValidationError", details: result.error.flatten() });
      return;
    }
    req[source] = result.data;
    next();
  };

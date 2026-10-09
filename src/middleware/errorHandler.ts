import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../utils/error.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.code, message: err.message });
    return;
  }

  console.error(err);
  res
    .status(500)
    .json({ error: "InternalServerError", message: "Something went wrong" });
};

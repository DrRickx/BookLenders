import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 does not catch rejected promises from async handlers.
// This wrapper forwards any error to the error-handling middleware.
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

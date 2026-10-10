import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as loanService from "../services/loan.services";
import { createLoanSchema } from "../schema/loan.schema";
import { validate } from "../middleware/validate";
import { idParamSchema } from "../schema/common.schema";

export const loanRouter = Router();

loanRouter.use(requireAuth);

loanRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    res.json(await loanService.listLoanForMembers(req.user!.id));
  }),
);

loanRouter.post(
  "/",
  validate(createLoanSchema),
  asyncHandler(async (req, res) => {
    const loan = await loanService.borrowBook(req.user!.id, req.body.bookId);
    res.status(201).json(loan);
  }),
);

loanRouter.post(
  "/:id/return",
  validate(idParamSchema, "params"),
  asyncHandler(async (req, res) => {
    res.json(await loanService.returnLoan(req.params.id as string, req.user!));
  }),
);

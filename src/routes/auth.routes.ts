import { Router } from "express";
import { loginSchema, registerSchema } from "../schema/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import * as authService from "../services/auth.services";
export const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }),
);

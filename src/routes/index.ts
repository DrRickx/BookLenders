import { Router } from "express";
import { authRouter } from "./auth.routes";
import { bookRouter } from "./book.routes";
import { loanRouter } from "./loan.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/loans", loanRouter);

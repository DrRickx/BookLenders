import { Router } from "express";
import { authRouter } from "./auth.routes";
import { bookRouter } from "./book.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/book", bookRouter);

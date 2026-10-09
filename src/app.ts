import express from "express";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(express.json());

app.use("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Welcome to BookLenders API",
  });
});

//  Bring back after creating the folders

// api.use("/api", apiRouter);

// app.get("/docs.json", (_req, res) => {
//   res.json(openApiDocument);
// });

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(notFoundHandler);
app.use(errorHandler);

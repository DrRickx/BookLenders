import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("app basics", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      message: "Welcome to BookLenders API",
    });
  });

  it("return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not Found");
  });

  it("protects loan routes", async () => {
    const res = await request(app).get("/api/loans/me");
    expect(res.status).toBe(401);
  });

  it("validates the login body", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });
});

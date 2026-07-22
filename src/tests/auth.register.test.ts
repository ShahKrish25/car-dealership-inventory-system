import request from "supertest";
import app from "../app";
// import authRoutes from "../routes/auth.routes";


describe("POST /api/auth/register", () => {
  it("should register a new user and return 201 with a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Krish",
      email: "krish@test.com",
      password: "mypassword123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 400 if email already exists", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Krish",
      email: "dup@test.com",
      password: "pass1",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Krish2",
      email: "dup@test.com",
      password: "pass2",
    });
    expect(res.status).toBe(400);
  });
});
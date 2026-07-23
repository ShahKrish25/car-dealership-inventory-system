import request from "supertest";
import app from "../app";
import User from "../models/user.model";


describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Krish",
      email: "krish@test.com",
      password: "mypassword123",
    });
  });

  it("should login an existing user and return 200 with a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "krish@test.com",
      password: "mypassword123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "krish@test.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
  });

  it("should return 401 if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@test.com",
      password: "mypassword123",
    });

    expect(res.status).toBe(401);
  });

  it("should return 500 when login persistence fails", async () => {
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("database error"));

    const res = await request(app).post("/api/auth/login").send({
      email: "error@test.com",
      password: "mypassword123",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error");
    jest.restoreAllMocks();
  });
});
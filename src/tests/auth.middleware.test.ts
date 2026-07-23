import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticate, isAdmin, AuthRequest } from "../middleware/auth.middleware";

describe("Auth Middleware", () => {
  it("should return 401 if no token is provided", () => {
    const req = {
      headers: {},
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", () => {
    const token = jwt.sign(
      { id: "123", role: "user" },
      process.env.JWT_SECRET as string
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    const req = {
      user: { id: "123", role: "user" },
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if user is admin", () => {
    const req = {
      user: { id: "123", role: "admin" },
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});


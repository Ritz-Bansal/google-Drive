import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT = process.env.JWT!;

function authFunction(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers.authorization;
    if (!headers) {
      return res.status(401).json({
        message: "No headers",
      });
    }

    const token = headers.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const decode = jwt.verify(token, JWT) as JwtPayload;
    req.userId = decode.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export default authFunction;

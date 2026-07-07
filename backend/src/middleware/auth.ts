import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { Request, Response, NextFunction } from "express";
import { getEnv } from "../utils/env";

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const { accessKey } = getEnv();

    if (!accessKey) {
      throw new Error("JWT access key is not configured");
    }

    const decoded = jwt.verify(token, accessKey) as Pick<
      IUser,
      "_id" | "email" | "role"
    >;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

function role(...roles: IUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Access denied. Not authenticated." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
}

export { auth, role };

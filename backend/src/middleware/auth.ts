import { IUser } from "../types";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import { HttpError } from "../utils/http-error";

function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Access denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];
  req.user = verifyAccessToken(token);
  next();
}

function role(...roles: IUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new HttpError(401, "Access denied. Not authenticated.");
    }

    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, "Access denied. Insufficient permissions.");
    }

    next();
  };
}

export { auth, role };

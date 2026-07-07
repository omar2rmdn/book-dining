import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { HttpError } from "./http-error";
import { getEnv } from "./env";

function generateToken(data: Pick<IUser, "_id" | "email" | "role">) {
  const { refreshKey, accessKey } = getEnv();

  if (!refreshKey || !accessKey) {
    throw new HttpError(500, "Both Refresh and Access JWT keys are required");
  }

  const refreshToken = jwt.sign(data, refreshKey, {
    expiresIn: "60d",
  });

  const accessToken = jwt.sign(data, accessKey, {
    expiresIn: "60m",
  });

  return { refreshToken, accessToken };
}

function verifyAccessToken(token: string) {
  const { accessKey } = getEnv();

  if (!accessKey) {
    throw new HttpError(500, "JWT access key is not configured");
  }

  try {
    return jwt.verify(token, accessKey) as Pick<
      IUser,
      "_id" | "email" | "role"
    >;
  } catch {
    throw new HttpError(401, "Invalid or expired token.");
  }
}

function verifyRefreshToken(token: string) {
  const { refreshKey } = getEnv();

  if (!refreshKey) {
    throw new HttpError(500, "Server configuration error");
  }

  try {
    return jwt.verify(token, refreshKey) as Pick<
      IUser,
      "_id" | "email" | "role"
    >;
  } catch {
    throw new HttpError(401, "Invalid refresh token");
  }
}

export { generateToken, verifyAccessToken, verifyRefreshToken };

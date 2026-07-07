import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { getEnv } from "./env";

function generateToken(data: Pick<IUser, "_id" | "email" | "role">) {
  const { refreshKey, accessKey } = getEnv();

  if (!refreshKey || !accessKey) {
    throw new Error("Both Refresh and Access JWT keys are required");
  }

  const refreshToken = jwt.sign(data, refreshKey, {
    expiresIn: "60d",
  });

  const accessToken = jwt.sign(data, accessKey, {
    expiresIn: "60m",
  });

  return { refreshToken, accessToken };
}

export { generateToken };

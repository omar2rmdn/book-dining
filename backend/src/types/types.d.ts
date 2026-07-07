import { IUser } from ".";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "_id" | "email" | "role">;
    }
  }
}

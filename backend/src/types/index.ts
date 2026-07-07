import { type Document } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: "user" | "admin" | "owner";
}

export type { IUser };

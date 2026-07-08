import { Types, type Document } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: "user" | "admin" | "owner";
}

interface IRestaurant extends Document {
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  image: string;
  chef: string;
  tags: string[];
  availableSlots: string[];
  exclusive: boolean;
  owner: Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  totalSeats: number;
}

export type { IUser, IRestaurant };

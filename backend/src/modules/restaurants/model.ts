import { Schema, model } from "mongoose";
import { IRestaurant } from "../../types";

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    chef: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    availableSlots: {
      type: [String],
      default: [],
    },
    exclusive: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    totalSeats: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

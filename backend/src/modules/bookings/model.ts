import { Schema, model, Types, type Document } from "mongoose";
import crypto from "crypto";

interface IBooking extends Document {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  status: "confirmed" | "cancelled" | "completed";
  bookingId: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    occasion: {
      type: String,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.pre("save", function () {
  if (this.bookingId) {
    return;
  }

  const generatedId = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + crypto.randomInt(26)),
  ).join("");

  this.bookingId = `GR-${generatedId}`;
});

export const Booking = model<IBooking>("Booking", bookingSchema);
export type { IBooking };

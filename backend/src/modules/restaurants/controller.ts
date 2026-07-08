import { Request, Response } from "express";
import { Restaurant } from "./model";
import { Booking } from "../bookings/model";
import { getRestaurantSortOption } from "../../utils/sort";
import { HttpError } from "../../utils/http-error";

async function getRestaurants(req: Request, res: Response) {
  const {
    search,
    cuisine,
    tags,
    location,
    priceRange,
    minRating,
    exclusive,
    sort = "newest",
    page = "1",
    limit = "10",
  } = req.query;

  const query: any = {};

  // Search multiple fields
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { cuisine: { $regex: search, $options: "i" } },
      { chef: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filters
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (cuisine) {
    query.cuisine = { $regex: cuisine, $options: "i" };
  }

  if (tags) {
    query.tags = {
      $in: String(tags)
        .split(",")
        .map((tag) => tag.trim()),
    };
  }

  if (priceRange) {
    query.priceRange = priceRange;
  }

  if (minRating) {
    query.rating = {
      $gte: Number(minRating),
    };
  }

  if (exclusive !== undefined) {
    query.exclusive = exclusive === "true";
  }

  // Sorting
  const sortOption = getRestaurantSortOption(sort);

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  const restaurants = await Restaurant.find(query)
    .sort(sortOption)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const total = await Restaurant.countDocuments(query);

  return res.status(200).json({
    message: "Restaurants fetched successfully",
    page: pageNumber,
    totalPages: Math.ceil(total / pageSize),
    total,
    restaurants,
  });
}

async function getFeaturedRestaurants(req: Request, res: Response) {
  const restaurants = await Restaurant.find({
    exclusive: true,
    status: "approved",
  });

  return res.status(200).json({
    message: "Featured restaurants fetched successfully",
    restaurants,
  });
}

async function getRestaurantBySlug(req: Request, res: Response) {
  const slug = (req.params.slug as string).toLowerCase();

  const restaurant = await Restaurant.findOne({
    slug,
    status: "approved",
  });

  if (!restaurant) {
    throw new HttpError(404, "Restaurant not found");
  }

  return res.status(200).json({
    message: "Restaurant fetched successfully",
    restaurant,
  });
}

async function getActiveSlots(req: Request, res: Response) {
  const slug = (req.params.slug as string).toLowerCase();
  const date = req.query.date;

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, "Date is required in YYYY-MM-DD format");
  }

  const restaurant = await Restaurant.findOne({
    slug,
    status: "approved",
  });

  if (!restaurant) {
    throw new HttpError(404, "Restaurant not found");
  }

  const [year, month, day] = date.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(year, month - 1, day));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  const bookings = await Booking.find({
    restaurant: restaurant._id,
    status: { $ne: "cancelled" },
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).select("time");

  const bookedSlots = new Set(
    bookings.map((booking) => booking.time.trim().toLowerCase()),
  );

  const activeSlots = restaurant.availableSlots.filter(
    (slot) => !bookedSlots.has(slot.trim().toLowerCase()),
  );

  return res.status(200).json({
    message: "Active slots fetched successfully",
    date,
    restaurant: {
      _id: restaurant._id,
      slug: restaurant.slug,
      name: restaurant.name,
    },
    activeSlots,
    bookedSlots: bookings.map((booking) => booking.time),
  });
}

export {
  getRestaurants,
  getFeaturedRestaurants,
  getRestaurantBySlug,
  getActiveSlots,
};

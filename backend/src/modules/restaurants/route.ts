import { Router } from "express";
import {
  getActiveSlots,
  getFeaturedRestaurants,
  getRestaurantBySlug,
  getRestaurants,
} from "./controller";

const router = Router();

router.get("/", getRestaurants);
router.get("/featured", getFeaturedRestaurants);
router.get("/:slug/active-slots", getActiveSlots);
router.get("/:slug", getRestaurantBySlug);

export { router as restaurantsRouter };

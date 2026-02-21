import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  isFavorite,
} from "../controllers/favorite.controller.js";

const router = Router();

router.get("/me", requireAuth, getMyFavorites);
router.get("/:listingId", requireAuth, isFavorite);
router.post("/", requireAuth, addFavorite);
router.delete("/:listingId", requireAuth, removeFavorite);

export default router;
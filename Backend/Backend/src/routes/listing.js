import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";
import {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
   deleteListing
} from "../controllers/listing.controller.js";

const router = Router();

router.post("/", requireAuth, upload.array("photos", 10), createListing);
router.get("/me", requireAuth, getMyListings);
router.get("/:id", getListingById);
router.patch("/:id", requireAuth, upload.array("photos", 10), updateListing);
router.delete("/:id", requireAuth, deleteListing);
 

export default router;
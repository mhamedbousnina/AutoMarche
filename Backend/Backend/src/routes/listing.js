import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";
import { createListing } from "../controllers/listing.controller.js";


const router = Router();

router.post("/", requireAuth, upload.array("photos", 10), createListing);

export default router;
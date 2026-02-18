import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// ✅ IMPORTANT
router.get("/me", requireAuth, authController.me);

export default router;
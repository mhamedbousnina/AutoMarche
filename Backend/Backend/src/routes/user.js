import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getMe, updateMe, changeMyPassword, updateMyAvatar, deleteMyAvatar } from "../controllers/user.controller.js";
import { uploadAvatar } from "../config/upload.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.put("/me/password", requireAuth, changeMyPassword);

router.put("/me/avatar", requireAuth, uploadAvatar.single("avatar"), updateMyAvatar);
router.delete("/me/avatar", requireAuth, deleteMyAvatar);

export default router;
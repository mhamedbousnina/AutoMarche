// controllers/user.controller.js
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../models/user.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/users/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("fullName email phone avatarUrl");
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  res.status(200).json({
    success: true,
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl || "",
    },
  });
});

/**
 * PUT /api/users/me
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { fullName, phone, email } = req.body;

  if (email !== undefined) throw new AppError("Email ne peut pas être modifié", 400);
  if (!fullName || !phone) throw new AppError("fullName et phone sont requis", 400);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName: fullName.trim(), phone: phone.trim() },
    { new: true, runValidators: true }
  ).select("fullName email phone avatarUrl");

  res.status(200).json({
    success: true,
    message: "Profil mis à jour",
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl || "",
    },
  });
});

/**
 * PUT /api/users/me/password
 */
export const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("Tous les champs mot de passe sont requis", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("Les mots de passe ne correspondent pas", 400);
  }

  if (newPassword.length < 8) {
    throw new AppError("Le nouveau mot de passe doit contenir au moins 8 caractères", 400);
  }

  const user = await User.findById(req.user._id).select("passwordHash");
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new AppError("Mot de passe actuel incorrect", 400);

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Mot de passe mis à jour",
  });
});

/**
 * PUT /api/users/me/avatar
 * (req.file vient de multer)
 */
export const updateMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Aucun fichier envoyé", 400);

  const user = await User.findById(req.user._id).select("avatarUrl fullName email phone");
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  // supprimer ancien avatar local (optionnel)
  if (user.avatarUrl && user.avatarUrl.includes("/uploads/")) {
    const oldFile = user.avatarUrl.split("/uploads/")[1];
    const oldPath = path.join(process.cwd(), "uploads", oldFile);
    if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
  }

  user.avatarUrl = avatarUrl;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar mis à jour",
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    },
  });
});
export const deleteMyAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("avatarUrl fullName email phone");
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  // ✅ supprimer fichier local si existe
  if (user.avatarUrl && user.avatarUrl.includes("/uploads/")) {
    const oldFile = user.avatarUrl.split("/uploads/")[1];
    const oldPath = path.join(process.cwd(), "uploads", oldFile);
    if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
  }

  // ✅ supprimer dans DB
  user.avatarUrl = "";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar supprimé",
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    },
  });
});
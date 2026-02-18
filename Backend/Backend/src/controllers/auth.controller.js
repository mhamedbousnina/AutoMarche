import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import User from "../models/user.js";
import {
  registerSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
} from "../validations/auth.validation.js";
import * as authService from "../services/auth.service.js";
import { sanitize } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) throw new AppError(error.message, 400);

  const data = await authService.register(value);
  res.status(201).json({ success: true, ...data });
});

export const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) throw new AppError(error.message, 400);

  const data = await authService.login(value);
  res.json({ success: true, ...data });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { error, value } = forgotSchema.validate(req.body);
  if (error) throw new AppError(error.message, 400);

  await authService.forgotPassword(value);
  res.json({ success: true, message: "Si l’email existe, un lien a été envoyé." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { error, value } = resetSchema.validate(req.body);
  if (error) throw new AppError(error.message, 400);

  const data = await authService.resetPassword(value);
  res.json({ success: true, ...data });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
});

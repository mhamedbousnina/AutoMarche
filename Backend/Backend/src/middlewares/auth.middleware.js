// auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { AppError } from "../utils/AppError.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new AppError("Non autorisé", 401));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return next(new AppError("Non autorisé", 401));
    req.user = user;
    next();
  } catch {
    next(new AppError("Token invalide", 401));
  }
}
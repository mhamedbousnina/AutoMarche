import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { AppError } from "../utils/AppError.js";
import { sendResetEmail } from "./mail.service.js";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitize(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    
  };
}

export async function register(payload) {
  const { fullName, phone, email, password } = payload;

  const exists = await User.findOne({ email });
  if (exists) throw new AppError("Email déjà utilisé", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, phone, email, passwordHash });

  const token = signToken(user._id);
  return { user: sanitize(user), token };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Email ou mot de passe incorrect", 401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Email ou mot de passe incorrect", 401);

  const token = jwt.sign(
    { userId: user._id.toString() }, // ✅ IMPORTANT
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: sanitize(user) };
}

export async function forgotPassword(payload) {
  const { email } = payload;
  const user = await User.findOne({ email });

  // réponse OK même si email n’existe pas
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await user.save();

  const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;
  await sendResetEmail({ to: user.email, resetLink });
}

export async function resetPassword(payload) {
  const { token, newPassword } = payload;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  });

  if (!user) throw new AppError("Lien invalide ou expiré", 400);

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();

  const jwtToken = signToken(user._id);
  return { user: sanitize(user), token: jwtToken };
}

export { sanitize };
import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(80).required(),
  phone: Joi.string().min(6).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required(),
});
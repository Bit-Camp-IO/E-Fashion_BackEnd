import Joi from 'joi';

export interface LoginSchema {
  email: string;
  password: string;
}

export interface RegisterSchema {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

const passwordValidate = Joi.string()
  .trim()
  .min(8)
  .max(30)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-_])'))
  .required();

const confirmPasswordValidate = Joi.string().valid(Joi.ref('password')).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
})
  .label('body')
  .required();

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
  fullName: Joi.string().trim().min(2).max(55).required(),
  phone: Joi.string(),
});

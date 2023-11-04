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
  fullName: Joi.string().trim().min(2).max(55).required(),
  phone: Joi.string(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
});

export interface ChangePasswordSchema {
  oldPassword: string;
  password: string;
  confirmNewPassword: string;
}

export const changePasswordSchema = Joi.object<ChangePasswordSchema>({
  oldPassword: passwordValidate,
  password: passwordValidate,
  confirmNewPassword: confirmPasswordValidate,
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export interface ResetPasswordSchema {
  email: string;
  otp: string;
  newPassword: string;
}

export const resetPasswordSchema = Joi.object<ResetPasswordSchema>({
  email: Joi.string().email().required(),
  newPassword: passwordValidate,
  otp: Joi.string().length(6).required(),
});

export const verifyOTPSchema = Joi.object<Omit<ResetPasswordSchema, 'newPassword'>>({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

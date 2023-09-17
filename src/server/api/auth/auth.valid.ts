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

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginSchema:
 *     type: object
 *     required:
 *      - email
 *      - password
 *     properties:
 *      email:
 *        type: string
 *        example: 'user@example.com'
 *      password:
 *        type: string
 *        example: examplePassword_123
 *        description: At least 8 chracters, a combination of uppercase letters, lowercase letters, numbers, and symbols.
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
})
  .label('body')
  .required();

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterSchema:
 *     type: object
 *     required:
 *      - email
 *      - password
 *      - confirmPassword
 *      - fullName
 *     properties:
 *      email:
 *        type: string
 *        example: 'user@example.com'
 *      password:
 *        type: string
 *        example: examplePassword_123
 *        description: At least 8 chracters, a combination of uppercase letters, lowercase letters, numbers, and symbols.
 *      confirmPassword:
 *        type: string
 *        example: examplePassword_123
 *      fullName:
 *        type: string
 *        example: Mahmoud Khaled
 *      phone:
 *        type: string
 *        example: 01234567899
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().trim().min(2).max(55).required(),
  phone: Joi.string(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
});

/**
 * @openapi
 * components:
 *  schemas:
 *     ChangePasswordSchema:
 *      type: object
 *      properties:
 *        oldPassword:
 *          type: string
 *        password:
 *          description: New password
 *          type: string
 *        confirmNewPassword:
 *          type: string
 */
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

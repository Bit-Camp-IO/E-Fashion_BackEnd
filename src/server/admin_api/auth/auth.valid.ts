import Joi from 'joi';

export interface LoginSchema {
  email: string;
  password: string;
}

const passwordValidate = Joi.string()
  .trim()
  .min(8)
  .max(30)
  .required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
})
  .label('body')
  .required();


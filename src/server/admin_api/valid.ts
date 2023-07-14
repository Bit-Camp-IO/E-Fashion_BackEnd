import Joi from 'joi';

export interface AdminBody {
  email: string;
  password: string;
  phone: string;
  name: string;
  address: string;
  confirmPassword: string;
}

const passwordValidate = Joi.string().trim().min(8).max(30).required();
const confirmPasswordValidate = Joi.string().valid(Joi.ref('password')).required();

export const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
  name: Joi.string().trim().min(2).max(55).required(),
  phone: Joi.string().required(),
  address: Joi.string(),
})
  .label('body')
  .required();

export interface LoginSchema {
  email: string;
  password: string;
}

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
})
  .label('body')
  .required();

export interface CreateProductSchema {
  title: string;
  description: string;
  price: number;
  colors: {name: string; hex: string}[];
  sizes: string[];
}

export interface CreateCategorySchema {
  name: string;
  description: string;
  isMain: boolean;
}

const colorItem = Joi.object({
  name: Joi.string().required(),
  hex: Joi.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .required(),
}).required();

export const createProductSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().required(),
  colors: Joi.array().items(colorItem).default([]),
  sizes: Joi.array().items(Joi.string()).default([]),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  isMain: Joi.boolean().required(),
  subCategories: Joi.array().items(Joi.string()).optional(),
});

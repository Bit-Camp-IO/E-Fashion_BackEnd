import { Gender } from '@/core/gender';
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
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesPath: string[];
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
  imagesPath: Joi.array().items(Joi.string()),
});

export interface CreateCategorySchema {
  name: string;
  description: string;
  // isMain: boolean;
  gender: Gender;
  image: string;
}

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().default(''),
  gender: Joi.number().min(Gender.BOTH).max(Gender.FEMALE).required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
});

export interface CreateBrandSchema {
  name: string;
  description: string;
  link: string;
  logo: string;
}

export const createBrandSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  link: Joi.string().uri().required(),
  logo: Joi.string().uri().required(),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  link: Joi.string().uri(),
  logo: Joi.string().uri(),
});

export interface UpdateProductSchema {
  title?: string;
  description?: string;
  price?: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

export const updateProductSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  sizes: Joi.array().items(Joi.string()),
});

export const productDiscount = Joi.object({
  discount: Joi.number().min(1).max(100).required(),
});

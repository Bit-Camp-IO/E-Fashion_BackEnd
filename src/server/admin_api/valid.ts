import { Gender } from '@/core/gender';
import { validateId } from '@/core/utils';
import Joi from 'joi';

export interface AdminBody {
  email: string;
  password: string;
  phone: string;
  name: string;
  address: string;
  confirmPassword: string;
}

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!validateId(value)) {
    return helpers.error('Invalid id');
  }
  return value;
});
const passwordValidate = Joi.string().trim().min(8).max(30).required();
const genderValidate = Joi.number().min(0).max(2).required();
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
  imagesUrl: string[];
  gender: Gender;
  categoryId?: string;
  brandId?: string;
}

const colorItem = Joi.object({
  name: Joi.string().required(),
  hex: Joi.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .required(),
});

export const createProductSchema = Joi.object<CreateProductSchema>({
  title: Joi.string().min(2).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().min(0).required(),
  colors: Joi.array().items(colorItem).default([]),
  sizes: Joi.array().items(Joi.string()).default([]),
  imagesUrl: Joi.array().items(Joi.string()).min(1).required(),
  gender: genderValidate,
  brandId: objectIdSchema,
  categoryId: objectIdSchema,
});

export interface CreateCategorySchema {
  name: string;
  description: string;
  gender: Gender;
  image: string;
}

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().required().allow(),
  gender: genderValidate,
});

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  image: Joi.string().uri(),
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
  gender?: number;
}

export const updateProductSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  sizes: Joi.array().items(Joi.string()),
  gender: Joi.number().min(0).max(2),
});

export const productDiscount = Joi.object({
  discount: Joi.number().min(1).required(),
});

import joi from "joi";

export interface CreateProductSchema {
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string };
  sizes: string[];
  adminId: string;
}

export interface UpdateProductSchema {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  colors?: { name: string; hex: string };
  sizes?: string[];
}

const colorSchema = joi
  .object({
    name: joi.string().required(),
    hex: joi
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .required(),
  })
  .required();

export const createProductSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  colors: colorSchema,
  sizes: joi.array().items(joi.string()).required(),
  addedBy: joi.string().required(),
});

export const updateProductSchema = joi.object({
  id: joi.string().required(),
  title: joi.string(),
  description: joi.string(),
  price: joi.number(),
  colors: colorSchema,
  sizes: joi.array().items(joi.string()),
});


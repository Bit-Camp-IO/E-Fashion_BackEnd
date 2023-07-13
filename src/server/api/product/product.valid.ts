import joi from 'joi';

export interface UpdateProductSchema {
  title?: string;
  description?: string;
  price?: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

export const updateProductSchema = joi.object({
  title: joi.string(),
  description: joi.string(),
  price: joi.number(),
  //  colors: colorSchema,
  sizes: joi.array().items(joi.string()),
});

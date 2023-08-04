import Joi from 'joi';

export const itemCartSchema = Joi.object({
  id: Joi.string().required(),
  size: Joi.string(),
  color: Joi.string(),
  quantity: Joi.number().min(1).required(),
});

export const editItemCartSchema = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

export interface AddressSchema {
  city: string;
  state: string;
  phone: string;
  postalCode: number;
  isPrimary: boolean;
}

export const addressSchema = Joi.object({
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.number().integer().required(),
  isPrimary: Joi.boolean().default(false),
});

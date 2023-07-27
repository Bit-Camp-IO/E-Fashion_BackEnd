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
  phone: Joi.string().required(),
  postalCode: Joi.number().integer().required(),
  isPrimary: Joi.boolean().default(false),
});

// method: 'VISA' | 'MASTERCARD';
export interface PaymentSchema {
  cardNumber: string;
  cardName: string;
  exMonth: number;
  exYear: number;
  cvv: number;
  provider: string;
}

export const paymentSchema = Joi.object({
  cardNumber: Joi.string().creditCard().required(),
  cardName: Joi.string().max(30).min(2).required(),
  exMonth: Joi.number().max(12).min(1).required(),
  exYear: Joi.number()
    .min(new Date().getFullYear() - 2000)
    .required(),
  cvv: Joi.number().min(100).max(9999).required(),
  provider: Joi.string().default('stripe'),
});

import Joi from 'joi';

export interface OrderSchema {
  addressId: string;
  phoneNumber: string;
}

export const orderSchema = Joi.object({
  addressId: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});

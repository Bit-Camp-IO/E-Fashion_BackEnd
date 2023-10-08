import Joi from 'joi';

export interface OrderSchema {
  phoneNumber: string;
  collectionId: string;
}

export const orderSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  collectionId: Joi.string(),
});

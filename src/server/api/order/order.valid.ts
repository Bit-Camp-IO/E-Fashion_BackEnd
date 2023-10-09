import Joi from 'joi';

export interface OrderSchema {
  collectionId: string;
}

export const orderSchema = Joi.object({
  collectionId: Joi.string(),
});

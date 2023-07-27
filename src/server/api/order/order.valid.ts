import { OrderData } from '@/core/order/interfaces';
import Joi from 'joi';
import { AddressSchema, PaymentSchema, addressSchema, paymentSchema } from '../user/user.valid';

export interface OrderSchema {
  cartId: string;
  address: string | AddressSchema;
  payment: string | PaymentSchema;
  paymentMethod: string;
  phoneNumber: string;
}

export const orderSchema = Joi.object<OrderData>({
  cartId: Joi.string().required(),
  address: Joi.alternatives().try(Joi.string().required(), addressSchema),
  payment: Joi.alternatives().try(Joi.string().required(), paymentSchema),
  paymentMethod: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});

import { OrderData } from "@/core/order/interfaces";
import Joi from "joi";

export const createOrderSchema = Joi.object<OrderData>({
    cartId: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
    address: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
    payment: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
    paymentMethod: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  });
  
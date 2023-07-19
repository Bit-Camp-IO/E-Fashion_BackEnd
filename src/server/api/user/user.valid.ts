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

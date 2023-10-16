import Joi from 'joi';

export const devSchema = Joi.object({
  device: Joi.string().trim().min(3).required(),
});

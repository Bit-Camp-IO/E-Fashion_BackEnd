import Joi from 'joi';

export const newMessageSchema = Joi.object({
  content: Joi.string().trim().required(),
});

export interface NewMessageSchema {
  content: string;
}

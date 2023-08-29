import Joi from 'joi';

export const itemCartSchema = Joi.object({
  id: Joi.string().required(),
  size: Joi.string(),
  color: Joi.string(),
  quantity: Joi.number().min(1).required(),
});

export interface EditUserSchem {
  email: string;
  fullName: string;
  phoneNumber: string;
}
export const editUserSchema = Joi.object<EditUserSchem>({
  email: Joi.string().email(),
  fullName: Joi.string().trim().min(2).max(55),
  phoneNumber: Joi.string(),
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

/**
 * @openapi
 * components:
 *   schemas:
 *     EditUserData:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         fullName:
 *           type: string
 *     CartItemData:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         size:
 *           type: string
 *         color:
 *           type: string
 *       required:
 *         - id
 *         - quantity
 *         - size
 *         - color
 */

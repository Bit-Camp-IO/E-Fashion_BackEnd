import Joi from 'joi';

export interface ManagerBody {
  email: string;
  password: string;
  phone: string;
  name: string;
  address: string;
}

const passwordValidate = Joi.string().trim().min(8).max(30).required();
const confirmPasswordValidate = Joi.string().valid(Joi.ref('password')).required();

export const managerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
  name: Joi.string().trim().min(2).max(55).required(),
  phone: Joi.string().required(),
})
  .label('body')
  .required();

import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import Joi from 'joi';

export const Validate = (validation: Joi.Schema) => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = (...args: any) => {
      const [req] = args;
      const validatedBody = validation.validate(req.body);
      if (validatedBody.error) {
        const message = validatedBody.error;
        throw new RequestError(message.message, HttpStatus.BadRequest);
      }
      req.body = validatedBody.value;
      return fn.apply(this, args);
    };
    return descriptor;
  };
};

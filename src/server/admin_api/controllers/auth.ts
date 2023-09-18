import { Controller, Validate } from '@server/decorator';
import { LoginSchema, loginSchema } from '../valid';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { login } from '@/core/admin';
import { InvalidCredentialsError } from '@/core/errors';

@Controller()
class AuthController {
  @Validate(loginSchema)
  public async login(req: Request, res: Response) {
    const body: LoginSchema = req.body;
    const response = await login(body);
    if (response.error) {
      if (response.error instanceof InvalidCredentialsError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, response.result);
  }
}

export default new AuthController();

import { Request, RequestHandler, Response } from 'express';
import { Controller } from '@server/decorator/controller';
import { Validate } from '@server/decorator/validate';
import { LoginSchema, RegisterSchema, loginSchema, registerSchema } from './auth.valid';
import { HttpStatus } from '@server/utils/status';
import { wrappResponse } from '@server/utils/response';
import AuthService from '@/core/auth';

interface IAuth {
  login: RequestHandler;
  register: RequestHandler;
}

@Controller()
class AuthController implements IAuth {
  @Validate(loginSchema)
  public login(req: Request, res: Response) {
    const body: LoginSchema = req.body;
    // TODO: call auth service method
    res.status(HttpStatus.Ok).json(wrappResponse(body, HttpStatus.Ok));
  }
  @Validate(registerSchema)
  public async register(req: Request, res: Response) {
    const body: RegisterSchema = req.body;
    const response = await AuthService.register({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      phone: body.phone,
    });
    res.status(HttpStatus.Created).json(wrappResponse(response, HttpStatus.Ok));
  }
}

export default new AuthController();

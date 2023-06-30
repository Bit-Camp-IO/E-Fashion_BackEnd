import { Request, RequestHandler, Response } from 'express';
import { Controller } from '@server/decorator/controller';
import { Validate } from '@server/decorator/validate';
import { LoginSchema, RegisterSchema, loginSchema, registerSchema } from './auth.valid';
import { HttpStatus } from '@server/utils/status';
import { wrappResponse } from '@server/utils/response';
import AuthService from '@/core/auth';
import { DuplicateUserError, InvalidCredentialsError, InvalidTokenError } from '@/core/auth/errors';
import RequestError from '@server/utils/errors';

interface IAuth {
  login: RequestHandler;
  register: RequestHandler;
}

@Controller()
class AuthController implements IAuth {
  @Validate(loginSchema)
  public async login(req: Request, res: Response) {
    const body: LoginSchema = req.body;
    const response = await AuthService.login(body);
    if (response.error) {
      if (response.error instanceof InvalidCredentialsError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw response.error;
    }
    res.status(HttpStatus.Ok).json(wrappResponse(response.result, HttpStatus.Ok));
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
    if (response.error) {
      if (response.error instanceof DuplicateUserError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw response.error;
    }
    res.status(HttpStatus.Created).json(wrappResponse(response.result, HttpStatus.Ok));
  }
  public async refresh(req: Request, res: Response) {
    const refreshToken = req.get('X-Refresh-Token');
    if (!refreshToken) {
      throw new RequestError('not authorized', 401);
    }
    const newAccessToken = AuthService.refreshToken(refreshToken);
    if (newAccessToken.error) {
      if (newAccessToken.error instanceof InvalidTokenError) {
        throw new RequestError(newAccessToken.error.message, HttpStatus.Unauthorized);
      }
      throw newAccessToken.error;
    }
    res
      .status(HttpStatus.Created)
      .json(wrappResponse({ accessToken: newAccessToken.result }, HttpStatus.Created));
  }
}

export default new AuthController();

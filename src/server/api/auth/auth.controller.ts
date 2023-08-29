import { Request, RequestHandler, Response } from 'express';
import { Controller } from '@server/decorator/controller';
import { Validate } from '@server/decorator/validate';
import { LoginSchema, RegisterSchema, loginSchema, registerSchema } from './auth.valid';
import { HttpStatus } from '@server/utils/status';
import { JWTAuthService, OAuthAuthService } from '@/core/auth';
import {
  DuplicateError,
  InvalidCredentialsError,
  InvalidTokenError,
  UnauthorizedGoogleError,
} from '@/core/errors';
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
    const response = await JWTAuthService.login(body);
    if (response.error) {
      if (response.error instanceof InvalidCredentialsError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, response.result);
  }

  @Validate(registerSchema)
  public async register(req: Request, res: Response) {
    const body: RegisterSchema = req.body;
    const response = await JWTAuthService.register({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      phone: body.phone,
    });
    if (response.error) {
      if (response.error instanceof DuplicateError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, response.result);
  }

  public async refresh(req: Request, res: Response) {
    const refreshToken = req.get('X-Refresh-Token');
    if (!refreshToken) {
      throw new RequestError('not authorized', 401);
    }
    const newAccessToken = await JWTAuthService.refreshToken(refreshToken);
    if (newAccessToken.error) {
      if (newAccessToken.error instanceof InvalidTokenError) {
        throw new RequestError(newAccessToken.error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, { accessToken: newAccessToken.result });
  }

  public google(_: Request, res: Response) {
    const url = OAuthAuthService.loginGooglePageUrl();
    res.redirect(url);
  }

  public async googleRedirect(req: Request, res: Response) {
    if (!req.query.code) {
      throw new RequestError('Only access from google Oauth2', HttpStatus.BadRequest);
    }
    const response = await OAuthAuthService.handleGoogleCode(req.query.code.toString());
    if (response.error) {
      if (response.error instanceof UnauthorizedGoogleError) {
        throw new RequestError(response.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, response.result);
  }
}

export default new AuthController();

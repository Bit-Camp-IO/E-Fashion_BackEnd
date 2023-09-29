import { Request, RequestHandler, Response } from 'express';
import { Controller } from '@server/decorator/controller';
import { Validate } from '@server/decorator/validate';
import {
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  changePasswordSchema,
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from './auth.valid';
import { HttpStatus } from '@server/utils/status';
import {
  JWTAuthService,
  OAuthAuthService,
  OTPVerification,
  createEmailVerificationOTP,
  createForgotPasswordOTP,
  resetPassword,
  verifyUserEmail,
} from '@/core/auth';
import {
  DuplicateError,
  InvalidCredentialsError,
  InvalidDataError,
  InvalidTokenError,
  NotFoundError,
  UnauthorizedGoogleError,
} from '@/core/errors';
import RequestError from '@server/utils/errors';
import { User } from '@/core/user';
import emails from '@/core/emails';
import { OTPType } from '@/database/models/OTP';
// import emails from '@/core/emails';

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
      throw new RequestError('not authorized', HttpStatus.Unauthorized);
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

  @Validate(changePasswordSchema)
  public async changePassword(req: Request, res: Response) {
    const body: ChangePasswordSchema = req.body;
    const user = new User(req.userId!);
    const error = await user.changePassword({
      newPassword: body.password,
      oldPassword: body.oldPassword,
    });
    if (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }
  public async sendVerifyEmail(req: Request, res: Response) {
    const otp = await createEmailVerificationOTP(req.userId!);
    if (otp.error) {
      if (otp.error instanceof InvalidDataError) {
        throw new RequestError(otp.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    const isSended = emails.sendOTPEmail(otp.result.otp, otp.result.user);
    if (!isSended) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }

  public async verifyEmail(req: Request, res: Response) {
    const otp = req.params['otp'].toString();
    if (!otp || otp.length !== 6) {
      throw new RequestError('Invalid OTP', HttpStatus.BadRequest);
    }
    const error = await verifyUserEmail(req.userId!, otp);
    if (error) {
      if (error instanceof InvalidDataError) {
        throw new RequestError(error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }

  @Validate(emailSchema)
  public async forgotPassword(req: Request, res: Response) {
    const otp = await createForgotPasswordOTP(req.body['email']);
    if (otp.error) {
      if (otp.error instanceof InvalidDataError) {
        throw new RequestError(otp.error.message, HttpStatus.BadRequest);
      }
      throw new RequestError(otp.error.message, HttpStatus.BadRequest)
    }
    const isSended = emails.sendOTPPassword(otp.result.otp, otp.result.user);
    if (!isSended) {
      throw new RequestError('Email sending faied', HttpStatus.Gone)
    }
    res.JSON(HttpStatus.Ok);
  }

  @Validate(resetPasswordSchema)
  public async resetPassword(req: Request, res: Response) {
    const body: ResetPasswordSchema = req.body;
    const error = await resetPassword(body);
    if (error) {
      if (error instanceof NotFoundError || error instanceof InvalidDataError) {
        throw new RequestError(error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }
  @Validate(verifyOTPSchema)
  public async verifyPasswordOTP(req: Request, res: Response) {
    const body: Omit<ResetPasswordSchema, 'newPassword'> = req.body;
    const isVerified = await OTPVerification(body.email, body.otp, OTPType.FORGOT_PASSWORD);
    if (isVerified.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, { ok: isVerified.result });
  }
}

export default new AuthController();

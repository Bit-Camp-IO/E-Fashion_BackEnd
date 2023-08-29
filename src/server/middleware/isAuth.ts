import { JWTAuthService } from '@/core/auth';
import { InvalidTokenError } from '@/core/errors';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { NextFunction, Request, Response } from 'express';

export async function isAuth(req: Request, _: Response, next: NextFunction) {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new RequestError('not authorized', HttpStatus.Unauthorized);
    }
    const headerSplited = authHeader.split(' ');
    if (headerSplited.length !== 2 && headerSplited[0] !== 'Bearer') {
      throw new RequestError('Invalid token format', HttpStatus.BadRequest);
    }
    const userId = JWTAuthService.verifyAccessToken(headerSplited[1]);
    if (userId.error) {
      if (userId.error instanceof InvalidTokenError) {
        throw new RequestError('not authorized', HttpStatus.Unauthorized);
      }
    }
    req.userId = userId.result as string;
    next();
  } catch (err) {
    if (err.code) {
      next(err);
      return;
    }
    next(RequestError._500());
  }
}

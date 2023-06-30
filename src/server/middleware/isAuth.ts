import AuthService from '@/core/auth';
import { InvalidTokenError } from '@/core/auth/errors';
import RequestError from '@server/utils/errors';
import { NextFunction, Request, Response } from 'express';

export async function isAuth(req: Request, _: Response, next: NextFunction) {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new RequestError('not authorized', 401);
    }
    const token = authHeader.split(' ')[1];
    const userId = AuthService.verifyAccessToken(token);
    if (userId.error) {
      if (userId.error instanceof InvalidTokenError) {
        throw new RequestError('not authorized', 401);
      }
    }
    req.userId = userId.result as string;
    next();
  } catch (err) {
    next(new RequestError('invalied token', 400));
  }
}

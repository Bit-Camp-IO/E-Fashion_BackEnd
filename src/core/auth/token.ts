import jwt from 'jsonwebtoken';
import { AppError } from '../errors';

export function createToken(payload: any, key: string, exp: string): string {
  return jwt.sign(payload, key, {
    algorithm: 'RS256',
    expiresIn: exp,
  });
}

export function verifyToken(token: string, key: string): any {
  try {
    return jwt.verify(token, key, {
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  } catch (err) {
    throw AppError.invalid('Token is not valid.');
  }
}

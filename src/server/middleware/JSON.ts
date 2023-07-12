import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {NextFunction, Request, Response} from 'express';

export function JSONMiddleware() {
  return (_: Request, res: Response, next: NextFunction) => {
    res.JSON = (statusCode: HttpStatus, data: unknown) => {
      res.status(statusCode).json(wrappResponse(data, statusCode));
    };
    next();
  };
}

declare global {
  namespace Express {
    export interface Response {
      JSON: (code: HttpStatus, data: unknown) => void;
    }
  }
}

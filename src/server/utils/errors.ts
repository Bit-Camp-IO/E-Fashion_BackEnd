import { ResponseTemplate } from '@type/server';
import { ErrorRequestHandler, Express } from 'express';
import { HttpStatus, codeToString } from './status';

class RequestError extends Error {
  public code: HttpStatus = HttpStatus.InternalServerError;
  constructor(message: string, code?: number) {
    super(message);
    if (code) this.code = code;
  }
}

export function errorMiddleware(app: Express) {
  const errorHandler: ErrorRequestHandler = async (
    err: RequestError,
    _,
    res,
    __,
  ) => {
    let code = err.code;
    if (!err.code || !(err instanceof RequestError)) {
      code = 500;
    }
    const responseError: ResponseTemplate = {
      status: 'error',
      message: codeToString(code),
      error: {
        code: code,
        message: err.message,
      },
    };
    res.status(code).json(responseError);
  };
  app.use(errorHandler);
}

export default RequestError;

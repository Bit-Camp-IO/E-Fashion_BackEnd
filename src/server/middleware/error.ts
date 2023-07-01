import { Express, ErrorRequestHandler } from 'express';
import RequestError from '@server/utils/errors';
import { codeToString } from '@server/utils/status';
import { ResponseTemplate } from '@type/server';

function errorMiddleware(app: Express) {
  const errorHandler: ErrorRequestHandler = async (err: RequestError, _, res, __) => {
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

export default errorMiddleware;

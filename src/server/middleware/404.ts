import { Express } from 'express';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';

function _404Middleware(app: Express) {
  app.use(() => {
    throw new RequestError('Not Found!', HttpStatus.NotFound);
  });
}

export default _404Middleware;

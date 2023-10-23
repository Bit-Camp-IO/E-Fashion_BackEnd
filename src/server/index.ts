import express from 'express';
import initApi from './api';
import initAdminApi from './admin_api';
import errorMiddleware from './middleware/error';
import Config from '@/config';
import _404Middleware from './middleware/404';
import cors from './middleware/cors';
import { JSONMiddleware } from './middleware/JSON';
import { stripeWebhook } from './middleware/stripe_webhook';
import { staticFileMiddleware } from './middleware/staticFile';
import { parseJsonMiddleware } from './middleware/parseJson';
import { createDocs } from './docs/swagger';
import { Server as ServerIo } from 'socket.io';
import * as http from 'http';
import { initSocket } from './websocket/sockets';
import { AddressInfo } from 'net';
import { logger } from './middleware/logger';

export function createServer(): express.Express {
  const app = express();
  const server = http.createServer(app);
  const io = new ServerIo(server, { cors: { origin: '*' } });
  app.disable('x-powered-by');

  app.set('io', io);
  initSocket(io);
  initMiddleware(app);
  initApi(app);
  initAdminApi(app);
  _404Middleware(app);
  errorMiddleware(app);
  server.listen(Config.PORT, () => {
    const address = server.address() as AddressInfo;
    log.info(`app listen on [${address.address}]:${address.port}`);
  });
  return app;
}

function initMiddleware(app: express.Express) {
  logger(app);
  stripeWebhook(app);
  cors(app);
  staticFileMiddleware(app);
  parseJsonMiddleware(app);
  JSONMiddleware(app);
  createDocs(app);
}

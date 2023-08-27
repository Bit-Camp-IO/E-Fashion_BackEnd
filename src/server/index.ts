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

function createServer(): express.Express {
  const app = express();

  initMiddleware(app);
  initApi(app);
  initAdminApi(app);
  _404Middleware(app);
  errorMiddleware(app);
  app.listen(Config.PORT, () => {
    console.log(`app listen in port ${Config.PORT}`);
  });
  return app;
}

function initMiddleware(app: express.Express) {
  cors(app);
  staticFileMiddleware(app);
  parseJsonMiddleware(app);
  JSONMiddleware(app);
  stripeWebhook(app);
  createDocs(app);
}

createServer();

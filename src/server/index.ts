import express from 'express';
import initApi from './api';
import initAdminApi from './admin_api';
import errorMiddleware from './middleware/error';
import Config from '@/config';
import _404Middleware from './middleware/404';
import cors from './middleware/cors';
import { JSONMiddleware } from './middleware/JSON';
import { join } from 'path';

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
  app.use('/api/u', express.static(join(__dirname, '..', '..', 'uploads')));
  app.use(express.json());
  app.use(JSONMiddleware());
}

createServer();

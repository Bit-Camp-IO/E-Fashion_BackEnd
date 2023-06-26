import express from 'express';
import api from './api';
import { errorMiddleware } from './utils/errors';
import Config from '@/config';

function createServer(): express.Express {
  const app = express();

  initMiddleware(app);
  api(app);
  errorMiddleware(app);

  app.listen(Config.PORT, () => {
    console.log(`app listen in port ${Config.PORT}`);
  });
  return app;
}

function initMiddleware(app: express.Express) {
  app.use(express.json());
}

createServer();

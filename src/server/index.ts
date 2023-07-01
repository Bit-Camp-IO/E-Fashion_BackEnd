import express from 'express';
import api from './api';
import errorMiddleware from './middleware/error';
import Config from '@/config';
import _404Middleware from './middleware/404';
import cors from './middleware/cors';

function createServer(): express.Express {
  const app = express();

  initMiddleware(app);
  api(app);
  _404Middleware(app);
  errorMiddleware(app);
  app.listen(Config.PORT, () => {
    console.log(`app listen in port ${Config.PORT}`);
  });
  return app;
}

function initMiddleware(app: express.Express) {
  cors(app);
  app.use(express.json());
}

createServer();

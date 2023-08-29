import express from 'express';
import { join } from 'path';

export function staticFileMiddleware(app: express.Express) {
  app.use('/api/u', express.static(join(__dirname, '..', '..', 'uploads')));
}

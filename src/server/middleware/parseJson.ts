import express from 'express';
export function parseJsonMiddleware(app: express.Express) {
  app.use(express.json());
}

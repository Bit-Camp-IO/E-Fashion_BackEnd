import { Express, NextFunction, Request, Response } from 'express';

export function securityHeader(app: Express) {
  app.disable('x-powered-by');
  app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains');
    next();
  });
}

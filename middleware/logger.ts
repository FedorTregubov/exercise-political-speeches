import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware (req: Request, _: Response, next: NextFunction): void {
  console.log(req.originalUrl);
  next();
}

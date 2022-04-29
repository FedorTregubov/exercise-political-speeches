import { Request, Response } from 'express';

export function errorMiddleware (_: Request, res: Response): void {
  res.status(404).json({ message: 'Route not found' });
};

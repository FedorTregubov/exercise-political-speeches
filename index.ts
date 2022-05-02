import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import evaluationRoutes from './routes/evaluation';
import { errorMiddleware } from './middleware/error';

// environment
dotenv.config();
const port = process.env.PORT;

export function createServer (): Express {
  const app: Express = express();

  // middleware
  app.use(express.json());

  // register routes
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });
  app.use('/evaluation', evaluationRoutes);
  // 404 error-handler
  app.use(errorMiddleware);

  return app;
}

export function start ():void {
  try {
    createServer().listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();

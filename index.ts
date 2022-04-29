import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { loggerMiddleware } from './middleware/logger';
import evaluationRoutes from './routes/evaluation';
import { errorMiddleware } from './middleware/error';

// enviroment
dotenv.config();
const port = process.env.PORT;

const app: Express = express();

// middleware
app.use(express.json());
app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// regiter routes
app.use('/evaluation', evaluationRoutes);
// 404 error-handler
app.use(errorMiddleware);

function start ():void {
  try {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();
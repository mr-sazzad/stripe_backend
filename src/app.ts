/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Response, Request } from 'express';

import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';



const app: Application = express();

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const stripeApiKey = process.env.STRIPE_KEY;

if (!stripeApiKey) {
  throw new Error('Stripe API key is not defined.');
}

const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2023-10-16',
});




app.use('/api/v1/', router);
// app.use('/api/v1/orders', OrderRoutes);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
globalErrorHandler(error, req, res);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });
});

export default app;

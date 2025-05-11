import express, { Router } from 'express';
import { errorHandler, ErrorResponse } from './utils/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const whitelist = ['http://localhost:5173', 'https://flai-sdk.netlify.app'];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json(), cookieParser());


const v1Router = Router();

// v1Router.use('/users', userRouter);
// v1Router.use('/books', bookRouter);

app.use('/api/v1', v1Router);

app.use('/*splat', (req, res) => {
  throw new ErrorResponse(`Check the route. You used ${req.originalUrl}`, 404);
});

app.use(errorHandler);

export default app;
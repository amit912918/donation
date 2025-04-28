import express, { NextFunction } from 'express';
import { Request, Response } from "express";
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { v1 } from './helpers/common/route_versions/v1';
import { errorHandler } from './middlewares/error/errorHandler.middlewares';
import path from "path";
import connectDB from "./helpers/common/init_mongodb"
import logger from './helpers/service/log/logger';

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', true);

const morganFormat = ':method :url :status :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
}));

app.use("/assets", express.static(path.join(__dirname, "../assets")));

// app.use('/', (req, res) => {
//   res.status(200).send({ message: "Server is running" })
// });

app.use('/v1', v1);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ statusCode: 404, message: "Route not found" });
});

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '9000', 10);

app.listen(PORT, () => {
  console.log(`|---: Server is Running at Port: ${PORT} :---|`);
});

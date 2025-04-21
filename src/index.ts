import express, { NextFunction } from 'express';
import { Request, Response } from "express";
import httpProxy from 'http-proxy';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { v1 } from './helpers/common/route_versions/v1';
import { errorHandler } from './middlewares/error/errorHandler.middlewares';
import path from "path";
import connectDB from "./helpers/common/init_mongodb"
import logger from './helpers/service/log/logger';

// Initialize dotenv
dotenv.config();
connectDB();

// Initialize Express app
const app = express();

// Create a proxy server
const proxy = httpProxy.createProxyServer();
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

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/assets", express.static(path.join(__dirname, "../assets")));

// app.use('/', (req, res) => {
//   res.status(200).send({ message: "Server is running" })
// });

app.use('/v1', v1);

// Catch-all route for undefined endpoints (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ statusCode: 404, message: "Route not found" });
});

// Error-handling middleware
app.use(errorHandler);

// Use PORT from environment variables or fallback to 5000
const PORT: number = parseInt(process.env.PORT || '9000', 10);

// Start the server
app.listen(PORT, () => {
  console.log(`|---: Server is Running at Port: ${PORT} :---|`);
});

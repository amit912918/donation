import express, { NextFunction } from 'express';
import { Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { v1 } from './helpers/common/route_versions/v1';
import { errorHandler } from './middlewares/error/errorHandler.middlewares';
import path from "path";
import connectDB from "./helpers/common/init_mongodb"

// Initialize dotenv
dotenv.config();
connectDB();

// Initialize Express app
const app = express();

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
//   res.status(200).send({message: "Server is running"})
// });

app.use('/v1', v1);

// Catch-all route for undefined endpoints (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ statusCode: 404, message: "Route not found" });
});

// Error-handling middleware
app.use(errorHandler);

// Use PORT from environment variables or fallback to 5000
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Start the server
app.listen(PORT, () => {
  console.log(`|---: Server is Running at Port: ${PORT} :---|`);
});

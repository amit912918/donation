import { Router } from "express";
import { createJob, createOrUpdateJobInteraction, getAllJobs, getAllJobWithUser, getJobById, getJobForUser, getJobInteractions, getJobWithUser, getUserInteractions, updateJob } from "@/controllers/job/job.controllers";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";

const appJobRouterV1 = Router();

// routes for job
appJobRouterV1.post('/create-job', verifyAccessToken, createJob);
appJobRouterV1.put('/update-job/:id', verifyAccessToken, updateJob);
appJobRouterV1.get('/get-all-job', verifyAccessToken, getAllJobs);
appJobRouterV1.get('/get-all-job-with-user', verifyAccessToken, getAllJobWithUser);
appJobRouterV1.get('/get-job-by-id/:id', verifyAccessToken, getJobById);

// Routes for job interaction
appJobRouterV1.get('/get-job-with-user/:id', verifyAccessToken, getJobWithUser);
appJobRouterV1.post('/create-update-job-interaction', verifyAccessToken, createOrUpdateJobInteraction);
appJobRouterV1.get('/get-job-interactions/:id', verifyAccessToken, getJobInteractions);
appJobRouterV1.get('/get-user-interactions/:id', verifyAccessToken, getUserInteractions);
appJobRouterV1.get('/get-job-for-user', verifyAccessToken, getJobForUser);

export default appJobRouterV1;
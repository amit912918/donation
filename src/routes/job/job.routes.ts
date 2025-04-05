import { Router } from "express";
import { createJob, createOrUpdateJobInteraction, getAllJobs, getJobById, getJobInteractions, getUserInteractions } from "@/controllers/job/job.controllers";

const appJobRouterV1 = Router();

appJobRouterV1.post('/create-job', createJob);
appJobRouterV1.get('/get-all-job', getAllJobs);
appJobRouterV1.get('/get-job-by-id/:id', getJobById);
appJobRouterV1.post('/create-update-job-interaction', createOrUpdateJobInteraction);
appJobRouterV1.get('/get-job-interactions/:id', getJobInteractions);
appJobRouterV1.get('/get-user-interactions/:id', getUserInteractions);

export default appJobRouterV1;
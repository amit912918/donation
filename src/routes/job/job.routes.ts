import uploadSingleImage from "@/middlewares/files/product/product.file.middlewares";
// import uploadThumbnailImages from "@/middlewares/files/job/thumbnail.file.middlewares";
import { Router } from "express";
// import uploadVideo from "@/middlewares/files/job/video.file.middlewares";
import { createJob, deleteJob, getJobById } from "@/controllers/job/job.controllers";

const appJobRouterV1 = Router();

appJobRouterV1.post('/create-job', createJob);
// appJobRouterV1.post('/upload-job-image', uploadThumbnailImages, uploadjobImages);
// appJobRouterV1.post('/upload-job-video', uploadVideo.single("video"), uploadjobVideo);
// appJobRouterV1.get('/get-all-job', getAlljobs);
appJobRouterV1.get('/get-job-by-id/:id', getJobById);
// appJobRouterV1.put('/update-job/:id', updatejob);
appJobRouterV1.delete('/delete-job/:id', deleteJob);
// appJobRouterV1.delete('/get-latest-job', getLatestjob);

export default appJobRouterV1;
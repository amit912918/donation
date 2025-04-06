import uploadThumbnailImages from "@/middlewares/files/mission/thumbnail.file.middlewares";
import { Router } from "express";
import uploadVideo from "@/middlewares/files/mission/video.file.middlewares";
import { uploadMultipleImages, uploadSingleVideo } from "@/controllers/files/files.controllers";

const appFilesRouterV1 = Router();

appFilesRouterV1.post('/upload-multiple-image', uploadThumbnailImages, uploadMultipleImages);
appFilesRouterV1.post('/upload-single-video', uploadVideo.single("video"), uploadSingleVideo);

export default appFilesRouterV1;
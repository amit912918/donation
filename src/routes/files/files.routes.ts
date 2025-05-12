import { Router } from "express";
import { uploadFiles, uploadImages, uploadVideos } from "@/controllers/files/files.controllers";
import uploadImagesMiddleware from "@/middlewares/files/file/image.file.middlewares";
import { uploadFileMiddleware } from "@/middlewares/files/file/pdf.file.middlewared";
import { uploadVideoMiddleware } from "@/middlewares/files/file/video.file.middlewares";

const appFilesRouterV1 = Router();

appFilesRouterV1.post('/upload-images', uploadImagesMiddleware, uploadImages);
appFilesRouterV1.post('/upload-videos', uploadVideoMiddleware, uploadVideos);
appFilesRouterV1.post('/upload-files', uploadFileMiddleware, uploadFiles);

export default appFilesRouterV1;
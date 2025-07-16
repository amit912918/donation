import { Router } from "express";
import uploadImagesMiddleware from "@/middlewares/files/file_s3/image.file.middlewares";
import { uploadVideoMiddleware } from "@/middlewares/files/file_s3/video.file.middlewares";
import { uploadFileMiddleware } from "@/middlewares/files/file_s3/pdf.file.middlewared";
import { uploadFiles, uploadImages, uploadVideos } from "@/controllers/files_s3/files.controllers";

const appS3FilesRouterV1 = Router();

appS3FilesRouterV1.post('/upload-images', uploadImagesMiddleware, uploadImages);
appS3FilesRouterV1.post('/upload-videos', uploadVideoMiddleware, uploadVideos);
appS3FilesRouterV1.post('/upload-files', uploadFileMiddleware, uploadFiles);

export default appS3FilesRouterV1;
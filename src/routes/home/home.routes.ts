import { createBanner, deleteBanner, getAllBanners, updateBanner, uploadBannerImages } from "@/controllers/home/home.controllers";
import bannerImagesMiddleware from "@/middlewares/files/home/image.home.files";
import { Router } from "express";

const appHomeRouterV1 = Router();

appHomeRouterV1.post("/create-banner", createBanner);
appHomeRouterV1.post('/upload-banner-images', bannerImagesMiddleware, uploadBannerImages);
appHomeRouterV1.get("/get-all-banner", getAllBanners);
appHomeRouterV1.put("/update-banner/:id", updateBanner);
appHomeRouterV1.delete("/delete-banner/:id", deleteBanner);

export default appHomeRouterV1;
import { createBanner, deleteBanner, getAllBanners, updateBanner } from "@/controllers/home/home.controllers";
import { Router } from "express";

const appHomeRouterV1 = Router();

appHomeRouterV1.post("/create-banner", createBanner);
appHomeRouterV1.get("/get-all-banner", getAllBanners);
appHomeRouterV1.put("/update-banner/:id", updateBanner);
appHomeRouterV1.delete("/delete-banner/:id", deleteBanner);

export default appHomeRouterV1;
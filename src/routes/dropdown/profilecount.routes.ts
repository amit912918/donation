import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createMarital, deleteMarital, getAllMaritals, getMaritalById, updateMarital } from "@/controllers/dropdown/marital.controllers";
import { createProfileCount, deleteProfileCount, getAllProfileCounts, getProfileCountById, updateProfileCount } from "@/controllers/dropdown/profile.controllers";

const appProfileCountRouterV1 = Router();

appProfileCountRouterV1.post("/", createProfileCount);
appProfileCountRouterV1.get("/", getAllProfileCounts);
appProfileCountRouterV1.get("/:id", getProfileCountById);
appProfileCountRouterV1.put("/:id", updateProfileCount);
appProfileCountRouterV1.delete("/:id", deleteProfileCount);

export default appProfileCountRouterV1;
import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { biodataInteraction, biodataSendAccept, createBiodata, deleteBiodata, getAllBiodatas, getBicholiyaList, getBiodataById, getBiodataByUserId, getNewlyJoined, recommendationBiodata, updateBiodata } from "@/controllers/matrimony/biodata.controllers";

const appMatrimonyRouterV1 = Router();

appMatrimonyRouterV1.post("/", verifyAccessToken, createBiodata);
appMatrimonyRouterV1.get("/", verifyAccessToken, getAllBiodatas);
appMatrimonyRouterV1.get("/get-bicholiya-list", verifyAccessToken, getBicholiyaList);
appMatrimonyRouterV1.get("/:id", verifyAccessToken, getBiodataById);
appMatrimonyRouterV1.get("/get-biodata-by-userid/:id", verifyAccessToken, getBiodataByUserId);
appMatrimonyRouterV1.put("/:id", verifyAccessToken, updateBiodata);
appMatrimonyRouterV1.delete("/:id", verifyAccessToken, deleteBiodata);

appMatrimonyRouterV1.get("/get-newly-joined", verifyAccessToken, getNewlyJoined);
appMatrimonyRouterV1.get("/recommendation-bidata", verifyAccessToken, recommendationBiodata);
appMatrimonyRouterV1.post("/biodata-interaction", verifyAccessToken, biodataInteraction);
appMatrimonyRouterV1.post("/biodata-send-accept", verifyAccessToken, biodataSendAccept);

export default appMatrimonyRouterV1;
import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { biodataCancelFavourite_Remove, biodataInteraction, biodataSendAccept, checkBiodataCompleted, createBiodata, deleteBiodata, getAllBiodataInteraction, getAllBioDataMatch, getAllBiodatas, getBicholiyaList, getBiodataById, getBiodataByUserId, getBiodataInteraction, getBiodataInteractionByUser, getFavouristList, getNewlyJoined, getReceiveRequest, getSendRequest, recommendationBiodata, updateBiodata } from "@/controllers/matrimony/biodata.controllers";

const appMatrimonyRouterV1 = Router();

// biodata route
appMatrimonyRouterV1.post("/", verifyAccessToken, createBiodata);
appMatrimonyRouterV1.get("/", verifyAccessToken, getAllBiodatas);
appMatrimonyRouterV1.get("/recommendation-bidata", verifyAccessToken, recommendationBiodata);
appMatrimonyRouterV1.get("/get-all-biodata-match", verifyAccessToken, getAllBioDataMatch);
appMatrimonyRouterV1.get("/get-bicholiya-list", verifyAccessToken, getBicholiyaList);
appMatrimonyRouterV1.get("/get-newly-joined", verifyAccessToken, getNewlyJoined);

// interaction route
appMatrimonyRouterV1.post("/biodata-interaction", verifyAccessToken, biodataInteraction);
appMatrimonyRouterV1.post("/biodata-send-accept", verifyAccessToken, biodataSendAccept);
appMatrimonyRouterV1.post("/biodata-cancel-favourite_remove", verifyAccessToken, biodataCancelFavourite_Remove);
appMatrimonyRouterV1.get("/get-send-request", verifyAccessToken, getSendRequest);
appMatrimonyRouterV1.get("/get-all-biodata-interaction", verifyAccessToken, getAllBiodataInteraction);
appMatrimonyRouterV1.get("/get-biodata-interaction-by-user", verifyAccessToken, getBiodataInteractionByUser);
appMatrimonyRouterV1.get("/get-receive-request", verifyAccessToken, getReceiveRequest);
appMatrimonyRouterV1.get("/get-favourite-list", verifyAccessToken, getFavouristList);
appMatrimonyRouterV1.get("/check-biodata-completed", verifyAccessToken, checkBiodataCompleted);

appMatrimonyRouterV1.get("/:id", verifyAccessToken, getBiodataById);
appMatrimonyRouterV1.get("/get-biodata-by-userid/:id", verifyAccessToken, getBiodataByUserId);
appMatrimonyRouterV1.put("/:id", verifyAccessToken, updateBiodata);
appMatrimonyRouterV1.delete("/:id", verifyAccessToken, deleteBiodata);
appMatrimonyRouterV1.get("/get-biodata-interaction/:id", verifyAccessToken, getBiodataInteraction);

export default appMatrimonyRouterV1;
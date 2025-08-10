import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { getAreaWiseBicholiyaForCandidate, getAreawiseCandidateForBicholiya, getBicholiyaAnalyticsData, getBicholiyaList, updateBioDataStatus } from "@/controllers/matrimony/bicholiya.matrimony.controllers";

const appBicholiyaRouterV1 = Router();

// bicholiya route
appBicholiyaRouterV1.post("/update-biodata-status", verifyAccessToken, updateBioDataStatus);
appBicholiyaRouterV1.get("/get-bicholiya-list", verifyAccessToken, getBicholiyaList);
appBicholiyaRouterV1.get("/get-bicholiya-analytics-data", verifyAccessToken, getBicholiyaAnalyticsData);
appBicholiyaRouterV1.get("/get-areawise-candidate-for-bicholiya", verifyAccessToken, getAreawiseCandidateForBicholiya);
appBicholiyaRouterV1.get("/get-areawise-bicholiya-for-candidate", verifyAccessToken, getAreaWiseBicholiyaForCandidate);

export default appBicholiyaRouterV1;
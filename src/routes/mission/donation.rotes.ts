import { donateToMission, getAllDonateById, getTopDonorOfTheWeek } from "@/controllers/mission/donation.conrollers";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { Router } from "express";

const appDonationRouterV1 = Router();

appDonationRouterV1.post('/donate-to-mission', verifyAccessToken, donateToMission);
appDonationRouterV1.get('/get-all-donate-by-id/:id', verifyAccessToken, getAllDonateById);
appDonationRouterV1.post('/get-weekly-bhamashas', verifyAccessToken, getTopDonorOfTheWeek);

export default appDonationRouterV1;
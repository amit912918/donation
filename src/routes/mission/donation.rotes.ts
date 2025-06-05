import { donateToMission, getDonateById, getMissionDonation, getTopDonor } from "@/controllers/mission/donation.conrollers";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { Router } from "express";

const appDonationRouterV1 = Router();

appDonationRouterV1.post('/donate-to-mission', verifyAccessToken, donateToMission);
appDonationRouterV1.get('/get-donate-by-id/:id', verifyAccessToken, getDonateById);
appDonationRouterV1.get('/get-mission-donation/:missionId', verifyAccessToken, getMissionDonation);
appDonationRouterV1.post('/get-bhamashas', verifyAccessToken, getTopDonor);

export default appDonationRouterV1;
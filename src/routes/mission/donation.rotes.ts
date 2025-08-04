import { donateToMission, getAllDonors, getDonateById, getDonationAnalyticsData, getDonationByUser, getMissionDonation, getTopDonor } from "@/controllers/mission/donation.conrollers";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { Router } from "express";

const appDonationRouterV1 = Router();

appDonationRouterV1.post('/donate-to-mission', verifyAccessToken, donateToMission);
appDonationRouterV1.get('/get-donate-by-id/:id', verifyAccessToken, getDonateById);
appDonationRouterV1.get('/get-mission-donation/:missionId', verifyAccessToken, getMissionDonation);
appDonationRouterV1.post('/get-bhamashas', verifyAccessToken, getTopDonor);
appDonationRouterV1.get('/get-all-donors', verifyAccessToken, getAllDonors);
appDonationRouterV1.get('/get-donation-by-user', verifyAccessToken, getDonationByUser);
appDonationRouterV1.get('/get-donation-analytics-data', verifyAccessToken, getDonationAnalyticsData);

export default appDonationRouterV1;
import { donateToMission, getTopDonorOfTheWeek } from "@/controllers/mission/donation.conrollers";
import { Router } from "express";

const appDonationRouterV1 = Router();

appDonationRouterV1.post('/donate-to-mission', donateToMission);
appDonationRouterV1.post('/get-weekly-bhamashas', getTopDonorOfTheWeek);

export default appDonationRouterV1;
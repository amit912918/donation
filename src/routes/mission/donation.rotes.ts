import { donateToMission } from "@/controllers/mission/donation.conrollers";
import { Router } from "express";

const appDonationRouterV1 = Router();

appDonationRouterV1.post('/donate-to-mission', donateToMission);

export default appDonationRouterV1;
import { createMission, deleteMission, getAllMissions, getMissionById, updateMission } from "@/controllers/mission/mission.controllers";
import { Login, registerUser, sendOtp, verifyOtp } from "@/controllers/user/auth/auth.controller";
import { Router } from "express";

const appMissionRouterV1 = Router();

appMissionRouterV1.post('/create-mission', createMission);
appMissionRouterV1.post('/get-all-mission', getAllMissions);
appMissionRouterV1.post('/get-mission-by-id', getMissionById);
appMissionRouterV1.post('/update-mission', updateMission);
appMissionRouterV1.post('/delete-mission', deleteMission);

export default appMissionRouterV1;
import { activeBiodataByAdmin, activeJobByAdmin, activeMissionByAdmin, getMentorList, makeRemoveAdmin, makeRemoveBicholiya, makeRemoveMentor } from "@/controllers/admin/admin.controllers";
import { verifyAdminAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { Router } from "express";

const appAdminRouterV1 = Router();

appAdminRouterV1.put('/make-remove-admin/:userId', verifyAdminAccessToken, makeRemoveAdmin);
appAdminRouterV1.get('/get-mentor-list', verifyAdminAccessToken, getMentorList);
appAdminRouterV1.put('/make-remove-mentor/:userId', verifyAdminAccessToken, makeRemoveMentor);
appAdminRouterV1.put('/make-remove-bicholiya/:userId', verifyAdminAccessToken, makeRemoveBicholiya);
appAdminRouterV1.put('/update-mission-status-by-admin/:missionId', verifyAdminAccessToken, activeMissionByAdmin);
appAdminRouterV1.put('/update-job-status-by-admin/:jobId', verifyAdminAccessToken, activeJobByAdmin);
appAdminRouterV1.put('/update-biodata-status-by-admin/:biodataId', verifyAdminAccessToken, activeBiodataByAdmin);

export default appAdminRouterV1;
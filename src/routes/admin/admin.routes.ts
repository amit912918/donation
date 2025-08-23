import { activeBiodataByAdmin, activeJobByAdmin, activeMissionByAdmin, getMentorList, makeRemoveBicholiya, makeRemoveMentor } from "@/controllers/admin/admin.controllers";
import { Router } from "express";

const appAdminRouterV1 = Router();

appAdminRouterV1.get('/get-mentor-list', getMentorList);
appAdminRouterV1.put('/make-remove-mentor/:userId', makeRemoveMentor);
appAdminRouterV1.put('/make-remove-bicholiya/:userId', makeRemoveBicholiya);
appAdminRouterV1.put('/update-mission-status-by-admin/:missionId', activeMissionByAdmin);
appAdminRouterV1.put('/update-job-status-by-admin/:jobId', activeJobByAdmin);
appAdminRouterV1.put('/update-biodata-status-by-admin/:biodataId', activeBiodataByAdmin);

export default appAdminRouterV1;
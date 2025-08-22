import { activeJobByAdmin, activeMissionByAdmin, getMentorList, makeRemoveBicholiya, makeRemoveMentor } from "@/controllers/admin/admin.controllers";
import { Router } from "express";

const appAdminRouterV1 = Router();

appAdminRouterV1.get('/get-mentor-list', getMentorList);
appAdminRouterV1.put('/make-remove-mentor/:userId', makeRemoveMentor);
appAdminRouterV1.put('/make-remove-bicholiya/:userId', makeRemoveBicholiya);
appAdminRouterV1.put('/update-mission-status-by-admin/:missionId', activeMissionByAdmin);
appAdminRouterV1.put('/update-job-status-by-admin/:jobId', activeJobByAdmin);

export default appAdminRouterV1;
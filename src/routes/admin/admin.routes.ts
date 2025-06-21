import { activeMissionByAdmin, getMentorList, makeRemoveBicholiya, makeRemoveMentor } from "@/controllers/admin/admin.controllers";
import { Router } from "express";

const appAdminRouterV1 = Router();

appAdminRouterV1.get('/get-mentor-list', getMentorList);
appAdminRouterV1.put('/make-remove-mentor/:userId', makeRemoveMentor);
appAdminRouterV1.put('/make-remove-bicholiya/:userId', makeRemoveBicholiya);
appAdminRouterV1.put('/make-mission-active-by-admin/:missionId', activeMissionByAdmin);

export default appAdminRouterV1;
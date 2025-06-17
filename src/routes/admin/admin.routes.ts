import { makeRemoveMentor } from "@/controllers/admin/admin.controllers";
import { Router } from "express";

const appAdminRouterV1 = Router();

appAdminRouterV1.put('/make-remove-mentor/:userId', makeRemoveMentor);

export default appAdminRouterV1;
import appUserAuthRouterV1 from "@/routes/user/auth/auth.route";
import { Router } from "express";
import appHomeRouterV1 from "@/routes/home/home.routes";
import appMissionRouterV1 from "@/routes/mission/mission.routes";
import appJobRouterV1 from "@/routes/job/job.routes";

const v1 = Router();

// User Endpoints Api's
v1.use('/auth', appUserAuthRouterV1);
v1.use('/home', appHomeRouterV1);
v1.use('/mission', appMissionRouterV1);
v1.use('/job', appJobRouterV1);

export { v1 };
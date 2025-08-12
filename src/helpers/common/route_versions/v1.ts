import appUserAuthRouterV1 from "@/routes/user/auth/auth.route";
import { Router } from "express";
import appHomeRouterV1 from "@/routes/home/home.routes";
import appMissionRouterV1 from "@/routes/mission/mission.routes";
import appJobRouterV1 from "@/routes/job/job.routes";
import appFilesRouterV1 from "@/routes/files/files.routes";
import appDonationRouterV1 from "@/routes/mission/donation.rotes";
import appGenderRouterV1 from "@/routes/dropdown/gender.routes";
import appGotraRouterV1 from "@/routes/dropdown/gotra.routes";
import appMaritalRouterV1 from "@/routes/dropdown/marital.routes";
import appProfileCountRouterV1 from "@/routes/dropdown/profilecount.routes";
import appQualificaionRouterV1 from "@/routes/dropdown/qualification.routes";
import appRelationRouterV1 from "@/routes/dropdown/relation.routes";
import appSiblingRouterV1 from "@/routes/dropdown/sibling.routes";
import appMatrimonyRouterV1 from "@/routes/matrimony/biodata.routes";
import appEventRouterV1 from "@/routes/event/news.routes";
import appAdminRouterV1 from "@/routes/admin/admin.routes";
import appS3FilesRouterV1 from "@/routes/files_s3/files.routes";
import appBicholiyaRouterV1 from "@/routes/matrimony/bicholiya.matrimony.routes";
import appBusinessSectorRouterV1 from "@/routes/dropdown/businessSector.routes";
import appBusinessTypeRouterV1 from "@/routes/dropdown/businessType.routes";
import appPositionRouterV1 from "@/routes/dropdown/position.routes";

const v1 = Router();

// User Endpoints Api's
v1.use('/auth', appUserAuthRouterV1);
v1.use('/home', appHomeRouterV1);
v1.use('/mission', appMissionRouterV1);
v1.use('/donate', appDonationRouterV1);
v1.use('/job', appJobRouterV1);
v1.use('/matrimony', appMatrimonyRouterV1);
v1.use('/file', appFilesRouterV1);
v1.use('/file-s3', appS3FilesRouterV1);
v1.use('/event', appEventRouterV1);
v1.use('/bicholiya', appBicholiyaRouterV1);

// Admin Endpoints Api's
v1.use('/gender', appGenderRouterV1);
v1.use('/gotra', appGotraRouterV1);
v1.use('/marital', appMaritalRouterV1);
v1.use('/profilecount', appProfileCountRouterV1);
v1.use('/qualification', appQualificaionRouterV1);
v1.use('/relation', appRelationRouterV1);
v1.use('/sibling', appSiblingRouterV1);
v1.use('/businesssector', appBusinessSectorRouterV1);
v1.use('/businesstype', appBusinessTypeRouterV1);
v1.use('/position', appPositionRouterV1);
v1.use('/admin', appAdminRouterV1);

export { v1 };
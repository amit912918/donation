import { createMission, deleteMission, getAllMissions, getLatestMission, getMissionById, updateMission, uploadMissionImages, uploadMissionVideo } from "@/controllers/mission/mission.controllers";
import uploadSingleImage from "@/middlewares/files/product/product.file.middlewares";
import uploadThumbnailImages from "@/middlewares/files/mission/thumbnail.file.middlewares";
import { Router } from "express";
import uploadVideo from "@/middlewares/files/mission/video.file.middlewares";

const appMissionRouterV1 = Router();

appMissionRouterV1.post('/create-mission', createMission);
appMissionRouterV1.post('/upload-mission-image', uploadThumbnailImages, uploadMissionImages);
appMissionRouterV1.post('/upload-mission-video', uploadVideo.single("video"), uploadMissionVideo);
appMissionRouterV1.get('/get-all-mission', getAllMissions);
appMissionRouterV1.get('/get-mission-by-id/:id', getMissionById);
appMissionRouterV1.put('/update-mission/:id', updateMission);
appMissionRouterV1.delete('/delete-mission/:id', deleteMission);
appMissionRouterV1.delete('/get-latest-mission', getLatestMission);

export default appMissionRouterV1;
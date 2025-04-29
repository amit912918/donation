import { createMission, deleteMission, getAllMissions, getLatestMission, getMissionById, updateMission, uploadMissionFiles, uploadMissionImages, uploadMissionVideo } from "@/controllers/mission/mission.controllers";
import { Router } from "express";
import uploadVideo from "@/middlewares/files/mission/video.file.middlewares";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import missionImagesMiddleware from "@/middlewares/files/mission/thumbnail.file.middlewares";
import { missionFileMiddleware } from "@/middlewares/files/mission/pdf.file.middlewared";

const appMissionRouterV1 = Router();

appMissionRouterV1.post('/create-mission', verifyAccessToken, createMission);
appMissionRouterV1.post('/upload-mission-images', verifyAccessToken, missionImagesMiddleware, uploadMissionImages);
appMissionRouterV1.post('/upload-mission-files', verifyAccessToken, missionFileMiddleware, uploadMissionFiles);
appMissionRouterV1.post('/upload-mission-video', verifyAccessToken, uploadVideo.single("video"), uploadMissionVideo);
appMissionRouterV1.get('/get-all-mission', verifyAccessToken, getAllMissions);
appMissionRouterV1.get('/get-mission-by-id/:id', verifyAccessToken, getMissionById);
appMissionRouterV1.put('/update-mission/:id', verifyAccessToken, updateMission);
appMissionRouterV1.delete('/delete-mission/:id', verifyAccessToken, deleteMission);
appMissionRouterV1.get('/get-latest-mission', verifyAccessToken, getLatestMission);

export default appMissionRouterV1;
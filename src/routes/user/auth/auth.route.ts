import { deleteProcess, getAllCity, getAllCountries, getAllProfile, getAllState, getSpecificCity, getSpecificState, getUserProfile, Login, registerUser, sendOtp, updateUserProfile, updateUserProfileImage, verifyOtp } from "@/controllers/user/auth/auth.controller";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { Router } from "express";

const appUserAuthRouterV1 = Router();

appUserAuthRouterV1.post('/login', Login);
appUserAuthRouterV1.post('/register-user', registerUser);
appUserAuthRouterV1.post('/update-user-profile', verifyAccessToken, updateUserProfile);
appUserAuthRouterV1.post('/process_delete', deleteProcess);
appUserAuthRouterV1.post('/update-user-profile-image', verifyAccessToken, updateUserProfileImage);
appUserAuthRouterV1.post('/get-user-profile', verifyAccessToken, getUserProfile);
appUserAuthRouterV1.post('/get-all-profile', verifyAccessToken, getAllProfile);
appUserAuthRouterV1.post('/send-otp', sendOtp);
appUserAuthRouterV1.post('/verify-otp', verifyOtp);
appUserAuthRouterV1.get('/countries', getAllCountries);
appUserAuthRouterV1.get('/states/:countryCode', getAllState);
appUserAuthRouterV1.get('/cities/:countryCode/:stateCode', getAllCity);
appUserAuthRouterV1.get('/get-specific-states', getSpecificState);
appUserAuthRouterV1.get('/get-specific-cities/:stateCode', getSpecificCity);

export default appUserAuthRouterV1;
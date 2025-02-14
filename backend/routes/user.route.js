import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { getUserProfile,followUnFollowUser,getSuggestedUsers,updateUser } from "../controllers/user.controller.js";


let router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/suggested",protectRoute, getSuggestedUsers);

router.post("/follow/:id",protectRoute, followUnFollowUser);

router.post("/update",protectRoute, updateUser);

export default router;

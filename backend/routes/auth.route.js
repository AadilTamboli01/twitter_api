import express from "express";
import { signup, login, logout,getMe } from "../controllers/auth.controller.js";
let router = express.Router();
import {protectRoute} from "../Middleware/protectRoute.js"

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;

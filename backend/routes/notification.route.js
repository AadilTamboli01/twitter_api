import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";
let router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;

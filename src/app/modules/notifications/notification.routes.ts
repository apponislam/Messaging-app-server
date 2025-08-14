import express from "express";
import auth from "../../middlewares/auth";
import { notificationControllers } from "./notification.controllers";

const router = express.Router();

router.get("/", auth, notificationControllers.getMyNotifications);
router.patch("/:id/read", auth, notificationControllers.markAsRead);

export const notificationRoutes = router;

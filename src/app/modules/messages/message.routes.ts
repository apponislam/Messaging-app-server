import express from "express";
import auth from "../../middlewares/auth";
import { messageController } from "./message.controller";

const router = express.Router();

router.post("/", auth, messageController.sendMessage);
router.get("/:userId", auth, messageController.getMessagesWithUser);

export const messageRoutes = router;

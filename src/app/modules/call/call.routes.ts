import express from "express";
import { CallController } from "./call.controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth, CallController.createCall);
router.patch("/:callId", auth, CallController.updateCall);
router.get("/:callId", auth, CallController.getCall);
router.get("/", auth, CallController.getUserCalls);
router.delete("/:callId", auth, CallController.deleteCall);

export const CallRoutes = router;

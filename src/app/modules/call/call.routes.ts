import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { callControllers } from "./call.controllers";
import { createCallSchema, updateCallSchema } from "./call.validation";

const router = express.Router();

router.post("/", validateRequest(createCallSchema), callControllers.createCallHandler);

router.get("/user/:userId", callControllers.getUserCallsHandler);

router.get("/:callId", callControllers.getCallHandler);

router.patch("/:callId", validateRequest(updateCallSchema), callControllers.updateCallHandler);

export const CallRoutes = router;

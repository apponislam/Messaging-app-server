"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRoutes = void 0;
const express_1 = __importDefault(require("express"));
const call_controllers_1 = require("./call.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", auth_1.default, call_controllers_1.CallController.createCall);
router.patch("/:callId", auth_1.default, call_controllers_1.CallController.updateCall);
router.get("/:callId", auth_1.default, call_controllers_1.CallController.getCall);
router.get("/", auth_1.default, call_controllers_1.CallController.getUserCalls);
router.delete("/:callId", auth_1.default, call_controllers_1.CallController.deleteCall);
exports.CallRoutes = router;

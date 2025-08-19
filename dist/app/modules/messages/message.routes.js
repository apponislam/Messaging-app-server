"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
router.post("/", auth_1.default, message_controller_1.messageController.sendMessage);
router.get("/:userId", auth_1.default, message_controller_1.messageController.getMessagesWithUser);
exports.messageRoutes = router;

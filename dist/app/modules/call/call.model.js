"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.callModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CallParticipantSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    socketId: { type: String, required: true },
    status: {
        type: String,
        enum: ["invited", "joined", "rejected", "missed"],
        default: "invited",
    },
    joinedAt: { type: Date },
    leftAt: { type: Date },
}, { _id: false });
const CallSchema = new mongoose_1.Schema({
    callId: { type: String, required: true, unique: true },
    initiator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    participants: { type: [CallParticipantSchema], required: true },
    type: { type: String, enum: ["audio", "video"], required: true },
    status: {
        type: String,
        enum: ["ringing", "ongoing", "completed", "missed", "rejected", "cancelled"],
        default: "ringing",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number },
    // Optional signaling data
    offer: { type: mongoose_1.Schema.Types.Mixed },
    answers: { type: Map, of: mongoose_1.Schema.Types.Mixed, default: {} },
    iceCandidates: { type: Map, of: [mongoose_1.Schema.Types.Mixed], default: {} },
}, { timestamps: true });
exports.callModel = mongoose_1.default.models.Call || mongoose_1.default.model("Call", CallSchema);

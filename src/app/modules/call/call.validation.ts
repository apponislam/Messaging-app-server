import { z } from "zod";

export const createCallSchema = z.object({
    callerId: z.string().min(1),
    recipientId: z.string().min(1),
    type: z.enum(["audio", "video"]),
});

export const updateCallSchema = z.object({
    status: z.enum(["ongoing", "completed", "missed"]).optional(),
    endedAt: z.date().optional(),
});

import * as z from "zod"

export const StudentPayloadSchema = z.object({
    mobileNo: z.string().regex(/^[0-9]{10}$/),
    username: z.string().min(3).max(50),
    roomNo: z.string().min(1).max(10)
});
export type StudentPayload = z.infer<typeof StudentPayloadSchema>;

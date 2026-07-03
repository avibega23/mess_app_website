import * as z from "zod"

export const LoginPayloadSchema = z.object({
    mobileNo: z.string().regex(/^[0-9]{10}$/),
    password: z.string().min(6).max(100)
});
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export type User = {
    _id: string;
    username: string;
    mobileNo: string;
    role: string;
    roomNo: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
import * as z from "zod"

export const StudentSchema = z.object({
    id: z.string(),
    username: z.string().min(3).max(50),
    fatherName: z.string().min(3).max(50),
    mobileNo: z.string().regex(/^[0-9]{10}$/, "Must be a 10 digit mobile number"),
    roomNo: z.string(),
    slot: z.string(),
    block: z.string(),
    floor: z.number(),
});
export type Student = z.infer<typeof StudentSchema>;

export const RegisterStudentSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters").max(50),
    fatherName: z.string().min(3, "Father name must be at least 3 characters").max(50),
    mobileNo: z.string().regex(/^[0-9]{10}$/, "Must be a 10 digit mobile number"),
    roomId: z.string().min(1, "Select a room"),
});
export type RegisterStudentPayload = z.infer<typeof RegisterStudentSchema>;

export const UpdateStudentSchema = RegisterStudentSchema;
export type UpdateStudentPayload = z.infer<typeof UpdateStudentSchema>;

export interface StudentFilters {
    block?: string;
    floor?: number;
    search?: string;
    page?: number;
    pageSize?: number;
}

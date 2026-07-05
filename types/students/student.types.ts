import * as z from "zod"

export const StudentSchema = z.object({
    _id: z.string(),
    username: z.string().min(3).max(50),
    mobileNo: z.string().regex(/^[0-9]{10}$/, "Must be a 10 digit mobile number"),
    roomNo: z.string(),
    block: z.string(),
    floor: z.number(),
    rollNo: z.string()
});
export type Student = z.infer<typeof StudentSchema>;

const usernameSchema = z.string()
    .min(3, { message: " name should be at least of 3 characters" })
    .max(200, { message: " name should not be longer then 200 characters" });
const mobileNoSchema = z.string()
    .min(10, { message: "mobile no shoud be of 10 numbers" })
    .max(10, { message: "mobile no cannot exceed 10 numbers" });

export const RegisterStudentSchema = z.object({
    username: usernameSchema,
    mobileNo: mobileNoSchema,
    roomNo: z.string(),
    rollNo: z.string(),
    block: z.string()
})


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

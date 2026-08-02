import * as z from "zod"

export const StudentSchema = z.object({
  _id: z.string(),
  username: z.string().min(3).max(50),
  mobileNo: z.string().regex(/^[0-9]{10}$/, "Must be a 10 digit mobile number"),
  slot: z.string(),
  rollNo: z.string(),
  roomId: z.object({
    _id: z.string(),
    roomNo: z.number()
  }),
  messId: z.object({
    _id: z.string(),
    messBlock: z.string(),
  }),
  floorId: z.object({
    _id: z.string(),
    floorNo: z.number()
  }),
});
export type Student = z.infer<typeof StudentSchema>;

const usernameSchema = z.string()
  .min(3, { message: " Name should be at least of 3 characters" })
  .max(200, { message: " Name should not be longer then 200 characters" });
const mobileNoSchema = z.string()
  .min(10, { message: "Mobile no shoud be of 10 numbers" })
  .max(10, { message: "Mobile no cannot exceed 10 numbers" });

export const RegisterStudentRequestSchema = z.object({
  username: usernameSchema,
  mobileNo: mobileNoSchema,
  slot: z.string(),
  rollNo: z.string(),
  messId: z.string(),
  roomId: z.string(),
  floorId: z.string(),
  hostelId: z.string(),
})
export type RegisterStudentRequest = z.infer<typeof RegisterStudentRequestSchema>;


export const RegisterStudentFormSchema = z.object({
  _id: z.string().optional(),
  name: usernameSchema,
  mobileNo: mobileNoSchema,
  slot: z.string().min(1, { message: "Slot Is Required" }),
  rollNo: z.string().min(1, { message: "Roll number is required" }),
  messId: z.object({
    _id: z.string(),
    messBlock: z.string(),
  }),
  roomId: z.object({
    _id: z.string(),
    roomNo: z.number(),
  }),
  floorId: z.object({
    _id: z.string(),
    floorNo: z.number(),
  })
})
export type RegisterStudentForm = z.infer<typeof RegisterStudentFormSchema>;

export const UpdateStudentFormSchema = RegisterStudentFormSchema;
export type UpdateStudentForm = z.infer<typeof UpdateStudentFormSchema>;

export const UpdateStudentRequestSchema = RegisterStudentRequestSchema
export type UpdateStudentRequest = z.infer<typeof UpdateStudentRequestSchema>

export interface StudentFilters {
  messId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  floor?: number;
}



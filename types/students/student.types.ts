import * as z from "zod"

export const StudentResponseSchema = z.object({
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
export type StudentResponse = z.infer<typeof StudentResponseSchema>;

const usernameSchema = z.string()
  .min(3, { message: " Name should be at least of 3 characters" })
  .max(200, { message: " Name should not be longer then 200 characters" });
const mobileNoSchema = z.string()
  .min(10, { message: "Mobile no shoud be of 10 numbers" })
  .max(10, { message: "Mobile no cannot exceed 10 numbers" });

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

export type RegisterStudentRequest =
  Omit<RegisterStudentForm, "_id" | "messId" | "roomId" | "floorId" | "name"> & {
    username: string,
    messId: string,
    hostelId: string,
    roomId: string,
    floorId: string
  }

export const UpdateStudentFormSchema = RegisterStudentFormSchema;
export type UpdateStudentForm = z.infer<typeof UpdateStudentFormSchema>;
export type UpdateStudentRequest = RegisterStudentRequest;


export interface StudentFilters {
  messId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  floor?: number;
}



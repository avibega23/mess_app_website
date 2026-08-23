import { RegisterStudentForm, RegisterStudentRequest } from "@/types/students/student.types";



export function toRegisterStudentRequest(
  form: RegisterStudentForm,
  ctx: { hostelId: string }
): RegisterStudentRequest {
  const { messId, roomId, floorId, _id, name, ...rest } = form;
  return {
    ...rest,
    username: name,
    messId: messId._id,
    roomId: roomId._id,
    floorId: floorId._id,
    hostelId: ctx.hostelId,
  };
}

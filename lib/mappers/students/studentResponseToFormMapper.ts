import { RegisterStudentForm, StudentResponse } from "@/types/students/student.types";

export function toRegisterStudentForm(student: StudentResponse): RegisterStudentForm {
  return {
    _id: student._id,
    name: student.username,
    mobileNo: student.mobileNo,
    roomId: student.roomId,
    rollNo: student.rollNo,
    messId: student.messId,
    slot: student.slot,
    floorId: student.floorId,
  };
}

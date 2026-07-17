import { useAuthStore } from "@/store/authStore";
import { RegisterStudentForm, RegisterStudentRequest } from "@/types/students/student.types";


export const registerStudentFormToRequestMapper = (payload: RegisterStudentForm): RegisterStudentRequest => {

  const messes = useAuthStore.getState().messes;
  const user = useAuthStore.getState().user;
  const newPayload: RegisterStudentRequest = {
    username: payload.name,
    mobileNo: payload.mobileNo,
    rollNo: payload.rollNo,
    slot: payload.slot,
    messId: messes?.find((mess) => mess.messBlock === payload.block)?._id || "",
    hostelId: user?.hostelId || "",
    roomId: "",
    floorId: "",
  }

  return newPayload;
}

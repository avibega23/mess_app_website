import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


import { RegisterStudentForm, RegisterStudentFormSchema, UpdateStudentForm } from "@/types/students/student.types"
import { registerStudent, updateStudent } from "../api/student"
import { toRegisterStudentRequest } from "@/lib/mappers/students/registerStudentFormToRequestMapper"
import { useRegisterStudent } from "../mutations/useRegisterStudent"


interface StudentFormReturn {
  form: UseFormReturn<RegisterStudentForm>,
  onUpdate: (data: RegisterStudentForm, hostelId: string) => void,
  onRegister: (data: RegisterStudentForm, hostelId: string) => void,
  isSubmitting: boolean,
}
const defaultValues: RegisterStudentForm = {
  name: "",
  rollNo: "",
  mobileNo: "",
  slot: "",
  messId: {
    _id: "",
    messBlock: "",
  },
  roomId: {
    _id: "",
    roomNo: 0,
  },
  floorId: {
    _id: "",
    floorNo: 0,
  },
}
export const useStudentForm = (): StudentFormReturn => {
  const form = useForm<RegisterStudentForm>({
    resolver: zodResolver(RegisterStudentFormSchema),
    defaultValues: defaultValues,
  })
  const { mutate: registerStudent } = useRegisterStudent();

  const onRegister = async (data: RegisterStudentForm, hostelId: string): Promise<void> => {

    const newPayload = toRegisterStudentRequest(data, { hostelId })
    registerStudent(newPayload);
  }

  const onUpdate = async (data: UpdateStudentForm, hostelId: string): Promise<void> => {
    const newPayload = toRegisterStudentRequest(data, { hostelId });
    await updateStudent(data._id || "", newPayload)
  }

  return {
    form,
    onRegister,
    onUpdate,
    isSubmitting: form.formState.isSubmitting
  }

}


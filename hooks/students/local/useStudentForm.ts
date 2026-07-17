import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


import { RegisterStudentForm, RegisterStudentFormSchema, UpdateStudentForm } from "@/types/students/student.types"
import { registerStudent, updateStudent } from "../api/student"
import { registerStudentFormToRequestMapper } from "@/lib/mappers/students/registerStudentFormToRequestMapper"


interface StudentFormReturn {
  form: UseFormReturn<RegisterStudentForm>,
  onUpdate: (data: RegisterStudentForm) => void,
  onRegister: (data: RegisterStudentForm) => void,
  isSubmitting: boolean,
}
const defaultValues: RegisterStudentForm = {
  name: "",
  rollNo: "",
  mobileNo: "",
  slot: "",
  block: "",
  roomNo: "",
  floorNo: "",
}
export const useStudentForm = (): StudentFormReturn => {
  const form = useForm<RegisterStudentForm>({
    resolver: zodResolver(RegisterStudentFormSchema),
    defaultValues: defaultValues,
  })

  const onRegister = async (data: RegisterStudentForm): Promise<void> => {

    const newPayload = registerStudentFormToRequestMapper(data)
    await registerStudent(newPayload);
  }

  const onUpdate = async (data: UpdateStudentForm): Promise<void> => {
    const newPayload = registerStudentFormToRequestMapper(data);
    await updateStudent(data._id || "", newPayload)
  }

  return {
    form,
    onRegister,
    onUpdate,
    isSubmitting: form.formState.isSubmitting
  }

}


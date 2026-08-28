import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { RegisterStudentForm, RegisterStudentFormSchema, UpdateStudentForm } from "@/types/students/student.types"
import { toRegisterStudentRequest } from "@/lib/mappers/students/registerStudentFormToRequestMapper"
import { useRegisterStudent } from "../mutations/useRegisterStudent"
import { useUpdateStudent } from "../mutations/useUpdateStudent"

interface StudentFormReturn {
  form: UseFormReturn<RegisterStudentForm>,
  onUpdate: (data: RegisterStudentForm, hostelId: string) => Promise<void>,
  onRegister: (data: RegisterStudentForm, hostelId: string) => Promise<void>,
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
  const { mutateAsync: registerStudent, isPending: isRegistering } = useRegisterStudent();
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();

  const onRegister = async (data: RegisterStudentForm, hostelId: string): Promise<void> => {
    const newPayload = toRegisterStudentRequest(data, { hostelId })
    await registerStudent(newPayload);
  }

  const onUpdate = async (data: UpdateStudentForm, hostelId: string): Promise<void> => {
    const newPayload = toRegisterStudentRequest(data, { hostelId });
    await updateStudent({ id: data._id ?? "", payload: newPayload });
  }

  return {
    form,
    onRegister,
    onUpdate,
    isSubmitting: form.formState.isSubmitting || isRegistering || isUpdating,
  }
}

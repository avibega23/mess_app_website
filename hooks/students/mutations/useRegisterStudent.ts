import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerStudent } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { roomKeys } from "@/hooks/rooms/queryKeys";
import { RegisterStudentRequest } from "@/types/students/student.types";

export const useRegisterStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterStudentRequest) => registerStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
    },
  });
};

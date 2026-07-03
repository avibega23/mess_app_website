import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerStudent } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { roomKeys } from "@/hooks/rooms/queryKeys";
import { RegisterStudentPayload } from "@/types/students/student.types";

export const useRegisterStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RegisterStudentPayload) => registerStudent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
            queryClient.invalidateQueries({ queryKey: roomKeys.all });
        },
    });
};

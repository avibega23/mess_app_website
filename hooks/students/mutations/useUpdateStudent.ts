import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { roomKeys } from "@/hooks/rooms/queryKeys";
import { billKeys } from "@/hooks/bills/queryKeys";
import { UpdateStudentPayload } from "@/types/students/student.types";

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentPayload }) =>
            updateStudent(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
            queryClient.invalidateQueries({ queryKey: roomKeys.all });
            queryClient.invalidateQueries({ queryKey: billKeys.all });
        },
    });
};

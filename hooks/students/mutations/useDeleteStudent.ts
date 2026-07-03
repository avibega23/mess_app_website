import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { roomKeys } from "@/hooks/rooms/queryKeys";

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
            queryClient.invalidateQueries({ queryKey: roomKeys.all });
        },
    });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAllStudents } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { roomKeys } from "@/hooks/rooms/queryKeys";

export const useClearStudents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearAllStudents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
            queryClient.invalidateQueries({ queryKey: roomKeys.all });
        },
    });
};

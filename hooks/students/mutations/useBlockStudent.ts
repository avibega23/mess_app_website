import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockStudent, unblockStudent } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";

export const useBlockStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, block }: { id: string; block: boolean }) =>
      block ? blockStudent(id) : unblockStudent(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
    },
  });
};

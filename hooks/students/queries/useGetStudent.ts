import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";

export const useGetStudent = (id: string) => {
    return useQuery({
        queryKey: studentKeys.detail(id),
        queryFn: () => getStudentById(id),
        enabled: !!id,
    });
};

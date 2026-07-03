import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";


export const useGetStudents = () => {
    return useQuery({
        queryKey: studentKeys.get(),
        queryFn: getStudents
    });
};

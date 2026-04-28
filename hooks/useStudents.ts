import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/lib/api/students/student";

export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: getStudents
    });
};

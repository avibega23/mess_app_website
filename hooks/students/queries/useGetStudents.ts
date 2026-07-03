import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";
import { StudentFilters } from "@/types/students/student.types";

export const useGetStudents = (filters: StudentFilters = {}) => {
    return useQuery({
        queryKey: studentKeys.list(filters),
        queryFn: () => getStudents(filters),
        placeholderData: keepPreviousData,
    });
};

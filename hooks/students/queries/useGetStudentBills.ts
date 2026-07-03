import { useQuery } from "@tanstack/react-query";
import { getStudentBills } from "@/hooks/students/api/student";
import { studentKeys } from "../queryKeys";

export const useGetStudentBills = (studentId: string) => {
    return useQuery({
        queryKey: studentKeys.bills(studentId),
        queryFn: () => getStudentBills(studentId),
        enabled: !!studentId,
    });
};

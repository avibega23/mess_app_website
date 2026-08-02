import { StudentFilters } from "@/types/students/student.types";

export const studentKeys = {
    all: ["students"] as const,
    list: (filters: StudentFilters) => [...studentKeys.all, "list", filters] as const,
    detail: (id: string) => [...studentKeys.all, "detail", id] as const,
    bills: (id: string) => [...studentKeys.all, "bills", id] as const,
}

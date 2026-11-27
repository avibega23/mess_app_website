import { BillFilters } from "@/types/bills/bill.types";

export const billKeys = {
    all: ["bills"] as const,
    list: (filters: BillFilters) => [...billKeys.all, "list", filters] as const,
    month: (month: string, messId?: string) =>
        [...billKeys.all, "month", month, messId ?? ""] as const,
}

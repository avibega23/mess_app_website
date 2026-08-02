import { BillFilters } from "@/types/bills/bill.types";

export const billKeys = {
    all: ["bills"] as const,
    list: (filters: BillFilters) => [...billKeys.all, "list", filters] as const,
    month: (month: string) => [...billKeys.all, "month", month] as const,
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBills } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";
import { BillFilters } from "@/types/bills/bill.types";

export const useGetBills = (filters: BillFilters) => {
    return useQuery({
        queryKey: billKeys.list(filters),
        queryFn: () => getBills(filters),
        placeholderData: keepPreviousData,
        enabled: !!filters.month,
    });
};

import { useQuery } from "@tanstack/react-query";
import { getMonthBills } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";

export const useGetMonthBills = (month: string) => {
    return useQuery({
        queryKey: billKeys.month(month),
        queryFn: () => getMonthBills(month),
        enabled: !!month,
    });
};

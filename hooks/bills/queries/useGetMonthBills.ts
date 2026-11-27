import { useQuery } from "@tanstack/react-query";
import { getMonthBills } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";
import { useAuthStore } from "@/store/authStore";

export const useGetMonthBills = (month: string) => {
    const messId = useAuthStore((state) => state.user?.messId);

    return useQuery({
        queryKey: billKeys.month(month, messId),
        queryFn: () => getMonthBills(month, messId),
        enabled: !!month && !!messId,
    });
};

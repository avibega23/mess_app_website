import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateMonthBills } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";
import { studentKeys } from "@/hooks/students/queryKeys";
import { ReceiptSettings } from "@/types/receipts/receipt.types";

export const useGenerateBills = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: ReceiptSettings) => generateMonthBills(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billKeys.all });
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
        },
    });
};

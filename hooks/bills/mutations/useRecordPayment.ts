import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordPayment } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";
import { studentKeys } from "@/hooks/students/queryKeys";
import { RecordPaymentPayload } from "@/types/bills/bill.types";

export const useRecordPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ billId, payment }: { billId: string; payment: RecordPaymentPayload }) =>
            recordPayment(billId, payment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billKeys.all });
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
        },
    });
};

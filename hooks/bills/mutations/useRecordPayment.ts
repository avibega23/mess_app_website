import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordPayment } from "@/hooks/bills/api/bill";
import { billKeys } from "../queryKeys";
import { studentKeys } from "@/hooks/students/queryKeys";
import { Bill, RecordPaymentPayload } from "@/types/bills/bill.types";

export const useRecordPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            bill,
            payment,
        }: {
            bill: Pick<Bill, "studentId" | "month">;
            payment: RecordPaymentPayload;
        }) => recordPayment(bill, payment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billKeys.all });
            queryClient.invalidateQueries({ queryKey: studentKeys.all });
        },
    });
};

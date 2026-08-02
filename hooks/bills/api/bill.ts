import { Bill, BillFilters, RecordPaymentPayload } from "@/types/bills/bill.types";
import { ApiResponse, Paginated } from "@/types/common/api.types";
import { ReceiptSettings } from "@/types/receipts/receipt.types";
import apiClient from "@/lib/apiClient/client";

export const getBills = async (filters: BillFilters): Promise<Paginated<Bill>> => {
    const { data } = await apiClient.get<ApiResponse<Paginated<Bill>>>("/bills", { params: filters });
    return data.data;
};

/** All bills of a month, un-paginated — used by the receipt engine preview. */
export const getMonthBills = async (month: string): Promise<Bill[]> => {
    const { data } = await apiClient.get<ApiResponse<Bill[]>>(`/bills/month/${month}`);
    return data.data;
};

/**
 * Applies diet prices, thresholds and fine to every bill of the month, and
 * rolls the previous month's outstanding balance (plus its accrued late fine)
 * into each student's new bill.
 */
export const generateMonthBills = async (
    settings: ReceiptSettings
): Promise<number> => {
    const { data } = await apiClient.post<ApiResponse<number>>("/bills/generate", settings);
    return data.data;
}

export const recordPayment = async (
    billId: string,
    payment: RecordPaymentPayload
): Promise<Bill> => {
    const { data } = await apiClient.post<ApiResponse<Bill>>(`/bills/${billId}/payments`, payment);
    return data.data;
};

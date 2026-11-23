import { Bill, BillFilters, RecordPaymentPayload } from "@/types/bills/bill.types";
import { ApiResponse, Paginated } from "@/types/common/api.types";
import { ReceiptSettings } from "@/types/receipts/receipt.types";
import apiClient from "@/lib/apiClient/client";
import {
    mapApiBill,
    mapApiPaginatedBills,
} from "@/lib/mappers/bills/mapApiBill";

export const getBills = async (filters: BillFilters): Promise<Paginated<Bill>> => {
    const { data } = await apiClient.get<ApiResponse<Parameters<typeof mapApiPaginatedBills>[0]>>(
        "/clerk/bills",
        { params: filters }
    );
    return mapApiPaginatedBills(data.data);
};

/** All bills of a month — backend has no /month route, so we request a large page. */
export const getMonthBills = async (month: string): Promise<Bill[]> => {
    const { data } = await apiClient.get<ApiResponse<Parameters<typeof mapApiPaginatedBills>[0]>>(
        "/clerk/bills",
        { params: { month, page: 1, pageSize: 100 } }
    );
    return mapApiPaginatedBills(data.data).data;
};

/**
 * Applies diet prices, thresholds and fine to every bill of the month, and
 * rolls the previous month's outstanding balance (plus its accrued late fine)
 * into each student's new bill.
 */
export const generateMonthBills = async (
    settings: ReceiptSettings
): Promise<number> => {
    const { data } = await apiClient.post<ApiResponse<number>>(
        "/clerk/monthly-config/set",
        settings
    );
    return data.data;
};

export const recordPayment = async (
    billId: string,
    payment: RecordPaymentPayload
): Promise<Bill> => {
    const { data } = await apiClient.put<ApiResponse<Parameters<typeof mapApiBill>[0]>>(
        "/clerk/createPayment",
        {
            amount: payment.amount,
            month: payment.date.slice(0, 7),
            paymentType: "CASH",
            billId,
        }
    );
    return mapApiBill(data.data);
};

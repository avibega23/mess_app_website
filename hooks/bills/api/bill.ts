import {
  Bill,
  BillFilters,
  RecordPaymentPayload,
} from "@/types/bills/bill.types";
import { ApiResponse, Paginated } from "@/types/common/api.types";
import {
  GenerateMonthlyConfigPayload,
  ReceiptSettings,
} from "@/types/receipts/receipt.types";
import apiClient from "@/lib/apiClient/client";
import {
  mapApiBill,
  mapApiBills,
  mapApiPaginatedBills,
} from "@/lib/mappers/bills/mapApiBill";

function toMonthlyConfigPayload(
  settings: ReceiptSettings,
): GenerateMonthlyConfigPayload {
  return {
    month: settings.month,
    dueDate: settings.dueDate,
    finePerDay: settings.lateFinePerDay,
    dietThreshold: settings.dietThreshold,
    specialDietThreshold: settings.specialDietThreshold,
    dietPrice: settings.dietPrice,
    specialDietPrice: settings.specialDietPrice,
    guestDietPrice: settings.guestDietPrice,
    serviceCharge: settings.serviceCharge,
    fineAbove: settings.fineThresholdAmount,
    finePercentage: settings.finePercent,
  };
}

export const getBills = async (
  filters: BillFilters,
): Promise<Paginated<Bill>> => {
  const { data } = await apiClient.get<
    ApiResponse<Parameters<typeof mapApiPaginatedBills>[0]>
  >("/clerk/bills", { params: filters });
  return mapApiPaginatedBills(data.data);
};

/** All bills of a month via dedicated unpaginated endpoint. */
export const getMonthBills = async (
  month: string,
  messId?: string,
): Promise<Bill[]> => {
  const { data } = await apiClient.get<
    ApiResponse<Parameters<typeof mapApiBills>[0]>
  >("/clerk/bills/month", { params: { month, messId } });
  return mapApiBills(data.data);
};

/**
 * Applies diet prices, thresholds and fine to every bill of the month, and
 * rolls the previous month's outstanding balance (plus its accrued late fine)
 * into each student's new bill.
 */
export const generateMonthBills = async (
  settings: ReceiptSettings,
): Promise<number> => {
  const { data } = await apiClient.post<ApiResponse<number>>(
    "/clerk/monthly-config/set",
    toMonthlyConfigPayload(settings),
  );
  return data.data;
};

export const recordPayment = async (
  bill: Pick<Bill, "studentId" | "month">,
  payment: RecordPaymentPayload,
): Promise<Bill> => {
  const { data } = await apiClient.put<
    ApiResponse<Parameters<typeof mapApiBill>[0]>
  >("/clerk/createPayment", {
    studentId: bill.studentId,
    amount: payment.amount,
    month: bill.month,
    paymentType: "CASH",
    paymentDate: payment.date,
  });
  return mapApiBill(data.data);
};

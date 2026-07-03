import { Bill, BillFilters, RecordPaymentPayload } from "@/types/bills/bill.types";
import { Paginated } from "@/types/common/api.types";
import { ReceiptSettings } from "@/types/receipts/receipt.types";
import {
    billBalance,
    computeReceipt,
    deriveBillStatus,
    lateFineOn,
    todayISO,
} from "@/lib/billing";
import { bills, delay, MONTHS } from "@/lib/mock/db";

// Real backend swap: replace each function body with the commented apiClient call.
// import apiClient from "@/lib/apiClient/client";

export const getBills = async (filters: BillFilters): Promise<Paginated<Bill>> => {
    // const { data } = await apiClient.get("/bills", { params: filters });
    // return data;
    await delay();
    const { month, page = 1, pageSize = 10 } = filters;

    const result = bills
        .filter((b) => b.month === month)
        .sort((a, b) => a.roomNo.localeCompare(b.roomNo) || a.slot.localeCompare(b.slot));

    const total = result.length;
    const start = (page - 1) * pageSize;
    return {
        data: result.slice(start, start + pageSize).map((b) => ({ ...b })),
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
};

/** All bills of a month, un-paginated — used by the receipt engine preview. */
export const getMonthBills = async (month: string): Promise<Bill[]> => {
    // const { data } = await apiClient.get(`/bills/month/${month}`);
    // return data;
    await delay();
    return bills
        .filter((b) => b.month === month)
        .sort((a, b) => a.roomNo.localeCompare(b.roomNo) || a.slot.localeCompare(b.slot))
        .map((b) => ({ ...b }));
};

/**
 * Applies diet prices, thresholds and fine to every bill of the month, and
 * rolls the previous month's outstanding balance (plus its accrued late fine)
 * into each student's new bill.
 */
export const generateMonthBills = async (
    settings: ReceiptSettings
): Promise<number> => {
    // const { data } = await apiClient.post("/bills/generate", settings);
    // return data.count;
    await delay(800);
    const monthIndex = MONTHS.indexOf(settings.month);
    const prevMonth = monthIndex > 0 ? MONTHS[monthIndex - 1] : null;

    let count = 0;
    for (const bill of bills) {
        if (bill.month !== settings.month) continue;

        const computed = computeReceipt(bill, settings);
        bill.dietAmount = computed.dietAmount;
        bill.specialDietAmount = computed.specialDietAmount;
        bill.fine = computed.fine;
        bill.totalAmount = computed.total;
        bill.dueDate = settings.dueDate;
        bill.lateFinePerDay = settings.lateFinePerDay;

        // carry the previous month's leftover balance forward (only once)
        if (!bill.generated && prevMonth) {
            const prev = bills.find(
                (b) =>
                    b.studentId === bill.studentId &&
                    b.month === prevMonth &&
                    b.generated &&
                    !b.carriedForward
            );
            if (prev) {
                // late fine keeps accruing on the old bill until it is carried
                prev.lateFine = lateFineOn(prev, todayISO());
                prev.status = deriveBillStatus(prev);
                const leftover = billBalance(prev) ?? 0;
                if (leftover > 0) {
                    bill.previousDue = leftover;
                    prev.carriedForward = true;
                }
            }
        }

        bill.generated = true;
        bill.status = deriveBillStatus(bill);
        count++;
    }
    return count;
};

/** Records a (possibly partial) payment; late fine is applied from the due date. */
export const recordPayment = async (
    billId: string,
    payment: RecordPaymentPayload
): Promise<Bill> => {
    // const { data } = await apiClient.post(`/bills/${billId}/payments`, payment);
    // return data;
    await delay();
    const bill = bills.find((b) => b.id === billId);
    if (!bill) throw new Error("Bill not found");
    if (!bill.generated) throw new Error("Bill has not been generated yet");
    if (bill.carriedForward)
        throw new Error("This bill was carried into the next month — collect it there");

    bill.lateFine = lateFineOn(bill, payment.date);
    bill.paidAmount += payment.amount;
    bill.lastPaymentDate = payment.date;
    bill.status = deriveBillStatus(bill);
    return { ...bill };
};

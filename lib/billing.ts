import { Bill } from "@/types/bills/bill.types";
import { ComputedReceipt, ReceiptSettings } from "@/types/receipts/receipt.types";

/**
 * Applies the mess billing rules to a raw bill:
 * - diets below `dietThreshold` are billed at the threshold count
 * - special diets below `specialDietThreshold` are billed at the threshold count
 * - a `finePercent` fine is added when the subtotal exceeds `fineThresholdAmount`
 */
export function computeReceipt(bill: Bill, settings: ReceiptSettings): ComputedReceipt {
    const billedDietCount = Math.max(bill.dietCount, settings.dietThreshold);
    const billedSpecialDietCount = Math.max(
        bill.specialDietCount,
        settings.specialDietThreshold
    );

    const dietAmount = billedDietCount * settings.dietPrice;
    const specialDietAmount = billedSpecialDietCount * settings.specialDietPrice;
    const subtotal = bill.canteenBill + dietAmount + specialDietAmount;

    const fine =
        subtotal > settings.fineThresholdAmount
            ? Math.round(subtotal * (settings.finePercent / 100))
            : 0;

    return {
        billId: bill.id,
        studentId: bill.studentId,
        studentName: bill.studentName,
        roomNo: bill.roomNo,
        slot: bill.slot,
        month: bill.month,
        canteenBill: bill.canteenBill,
        dietCount: bill.dietCount,
        billedDietCount,
        specialDietCount: bill.specialDietCount,
        billedSpecialDietCount,
        dietAmount,
        specialDietAmount,
        subtotal,
        fine,
        total: subtotal + fine,
        status: bill.status,
        generated: bill.generated,
    };
}

/** Everything the student owes on this bill: charges + carried dues + late fine. */
export function billAmountDue(bill: Bill): number | null {
    if (!bill.generated || bill.totalAmount === undefined) return null;
    return bill.totalAmount + bill.previousDue + bill.lateFine;
}

/** What is still left to pay on this bill. */
export function billBalance(bill: Bill): number | null {
    const due = billAmountDue(bill);
    return due === null ? null : due - bill.paidAmount;
}

export function daysLate(dueDate: string, onDate: string): number {
    const diff = new Date(onDate).getTime() - new Date(dueDate).getTime();
    return Math.max(0, Math.ceil(diff / 86_400_000));
}

/** Late fine owed if the bill were settled on `onDate`. */
export function lateFineOn(bill: Bill, onDate: string): number {
    if (!bill.dueDate || !bill.lateFinePerDay) return bill.lateFine;
    return Math.max(bill.lateFine, daysLate(bill.dueDate, onDate) * bill.lateFinePerDay);
}

export function deriveBillStatus(bill: Bill): Bill["status"] {
    const balance = billBalance(bill);
    if (balance !== null && balance <= 0) return "PAID";
    if (bill.paidAmount > 0) return "PARTIAL";
    return "UNPAID";
}

/** Default last-date-to-pay for a billing month: the 10th of the next month. */
export function defaultDueDate(month: string): string {
    const [year, m] = month.split("-").map(Number);
    const next = new Date(year, m, 10); // m is 0-indexed next month here
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}-10`;
}

export function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatMonth(month: string): string {
    const [year, m] = month.split("-").map(Number);
    return new Date(year, m - 1).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
    });
}

/** YYYY-MM for the given date (defaults to today). */
export function toMonthKey(date = new Date()): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
}

/** Billing month currently in focus (calendar month at module load). */
export const CURRENT_MONTH = toMonthKey();

/**
 * Contiguous YYYY-MM keys ending at `CURRENT_MONTH`.
 * Used by month pickers for bills / receipts.
 */
export const MONTHS: string[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (11 - i));
    return toMonthKey(d);
});

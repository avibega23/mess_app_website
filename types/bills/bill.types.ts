export type BillStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface Bill {
    id: string;
    studentId: string;
    studentName: string;
    roomNo: string;
    slot: string;
    month: string; // YYYY-MM
    canteenBill: number;
    dietCount: number;
    specialDietCount: number;
    /** true once the receipt engine has applied prices/fine for this month */
    generated: boolean;
    dietAmount?: number;
    specialDietAmount?: number;
    fine?: number;
    /** this month's charges only: canteen + diets + special + fine */
    totalAmount?: number;
    /** unpaid balance rolled over from the previous month (incl. its late fine) */
    previousDue: number;
    /** late fine accrued on this bill after its due date */
    lateFine: number;
    paidAmount: number;
    lastPaymentDate?: string; // YYYY-MM-DD
    /** last date to pay without late fine, set at generation */
    dueDate?: string; // YYYY-MM-DD
    lateFinePerDay?: number;
    /** true once the outstanding balance has been rolled into the next month */
    carriedForward?: boolean;
    status: BillStatus;
}

export interface RecordPaymentPayload {
    amount: number;
    date: string; // YYYY-MM-DD
}

export interface BillFilters {
    month: string;
    page?: number;
    pageSize?: number;
}

import * as z from "zod"
import { BillStatus } from "@/types/bills/bill.types";

export const ReceiptRulesSchema = z.object({
    dietPrice: z.number({ error: "Enter the diet price" }).positive("Diet price must be positive"),
    specialDietPrice: z.number({ error: "Enter the special diet price" }).positive("Special diet price must be positive"),
    dietThreshold: z.number({ error: "Required" }).int().min(0),
    specialDietThreshold: z.number({ error: "Required" }).int().min(0),
    fineThresholdAmount: z.number({ error: "Required" }).min(0),
    finePercent: z.number({ error: "Required" }).min(0).max(100),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the last date to pay"),
    lateFinePerDay: z.number({ error: "Required" }).min(0),
});
export type ReceiptRules = z.infer<typeof ReceiptRulesSchema>;

export const ReceiptSettingsSchema = ReceiptRulesSchema.extend({
    month: z.string().regex(/^\d{4}-\d{2}$/),
});
export type ReceiptSettings = z.infer<typeof ReceiptSettingsSchema>;

export const DEFAULT_RECEIPT_RULES = {
    dietThreshold: 20,
    specialDietThreshold: 2,
    fineThresholdAmount: 5000,
    finePercent: 5,
    lateFinePerDay: 10,
} as const;

export interface ComputedReceipt {
    billId: string;
    studentId: string;
    studentName: string;
    roomNo: string;
    slot: string;
    month: string;
    canteenBill: number;
    dietCount: number;
    /** diet count after applying the minimum threshold */
    billedDietCount: number;
    specialDietCount: number;
    billedSpecialDietCount: number;
    dietAmount: number;
    specialDietAmount: number;
    subtotal: number;
    fine: number;
    total: number;
    status: BillStatus;
    generated: boolean;
}

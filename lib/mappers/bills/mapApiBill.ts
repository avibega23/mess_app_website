import { Bill, BillStatus } from "@/types/bills/bill.types";
import { Paginated } from "@/types/common/api.types";

/** Raw bill row from GET /clerk/bills or GET /clerk/students/:id/bills */
export interface ApiBill {
  _id?: string;
  id?: string;
  studentId?: string;
  userId?: string;
  username?: string;
  studentName?: string;
  roomNo?: string | number;
  slot?: string;
  month?: string;
  canteenBill?: number;
  bill?: number;
  dietCount?: number;
  specialDietCount?: number;
  guestDietCount?: number;
  generated?: boolean;
  dietAmount?: number;
  specialDietAmount?: number;
  fine?: number;
  fineAmount?: number;
  totalAmount?: number;
  previousDue?: number;
  lateFine?: number;
  paidAmount?: number;
  lastPaymentDate?: string;
  paymentDate?: string | Date | null;
  dueDate?: string;
  lateFinePerDay?: number;
  carriedForward?: boolean;
  status?: string;
}

interface ApiPaginatedBills {
  data: ApiBill[];
  page: number;
  pageSize?: number;
  limit?: number;
  total: number;
  totalPages: number;
}

function asId(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return String(value);
}

function asDateString(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function mapStatus(raw?: string, carriedForward?: boolean): BillStatus {
  if (carriedForward || raw === "CARRIED_FORWARD") return "UNPAID";
  if (raw === "PAID") return "PAID";
  if (raw === "PARTIAL") return "PARTIAL";
  return "UNPAID";
}

export function mapApiBill(raw: ApiBill): Bill {
  const carriedForward =
    raw.carriedForward === true || raw.status === "CARRIED_FORWARD";

  return {
    id: asId(raw.id ?? raw._id),
    studentId: asId(raw.studentId ?? raw.userId),
    studentName: raw.username || raw.studentName || "",
    roomNo: raw.roomNo != null ? String(raw.roomNo) : "",
    slot: raw.slot ?? "",
    month: raw.month ?? "",
    canteenBill: raw.canteenBill ?? raw.bill ?? 0,
    dietCount: raw.dietCount ?? 0,
    specialDietCount: raw.specialDietCount ?? raw.guestDietCount ?? 0,
    generated: Boolean(raw.generated ?? raw.totalAmount != null),
    dietAmount: raw.dietAmount,
    specialDietAmount: raw.specialDietAmount,
    fine: raw.fine ?? raw.fineAmount,
    totalAmount: raw.totalAmount,
    previousDue: raw.previousDue ?? 0,
    lateFine: raw.lateFine ?? 0,
    paidAmount: raw.paidAmount ?? 0,
    lastPaymentDate: raw.lastPaymentDate ?? asDateString(raw.paymentDate),
    dueDate: raw.dueDate,
    lateFinePerDay: raw.lateFinePerDay,
    carriedForward,
    status: mapStatus(raw.status, carriedForward),
  };
}

export function mapApiBills(raw: ApiBill[] | undefined | null): Bill[] {
  return (raw ?? []).map(mapApiBill);
}

export function mapApiPaginatedBills(raw: ApiPaginatedBills): Paginated<Bill> {
  const pageSize = raw.pageSize ?? raw.limit ?? 10;
  return {
    data: mapApiBills(raw.data),
    page: raw.page,
    pageSize,
    total: raw.total,
    totalPages: raw.totalPages,
  };
}

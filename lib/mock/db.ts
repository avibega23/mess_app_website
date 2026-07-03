import { Student } from "@/types/students/student.types";
import { Room } from "@/types/rooms/room.types";
import { Bill } from "@/types/bills/bill.types";
import { defaultDueDate } from "@/lib/billing";

/**
 * In-memory mock database. Every mock API function reads/writes these arrays,
 * so the UI behaves like it is talking to a real backend (occupancy updates,
 * bill generation, mark-paid, etc. all persist for the browser session).
 *
 * Swap the functions in hooks/[domain]/api/*.ts to real apiClient calls when
 * the backend is ready — nothing outside those files touches this store.
 */

const SLOT_LABELS = ["A", "B", "C"] as const;
export const MONTHS = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
export const CURRENT_MONTH = "2026-06";

// Deterministic PRNG so mock data is stable across reloads
function mulberry32(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const rand = mulberry32(20260703);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

const FIRST_NAMES = [
    "Aarav", "Vivaan", "Karan", "Rohan", "Arjun", "Manpreet", "Gurpreet", "Harsh",
    "Simran", "Jaspreet", "Nikhil", "Aditya", "Sahil", "Rahul", "Deepak", "Vikram",
    "Amit", "Rajat", "Sandeep", "Tushar",
];
const LAST_NAMES = [
    "Sharma", "Singh", "Verma", "Gupta", "Bhullar", "Gill", "Kaur", "Mehta",
    "Chopra", "Malhotra", "Bansal", "Aggarwal", "Sidhu", "Brar",
];
const FATHER_PREFIX = ["Rajinder", "Surinder", "Mohinder", "Balwinder", "Harbans", "Kuldeep", "Jagdish", "Sukhdev"];

export const rooms: Room[] = [];
export const students: Student[] = [];
export const bills: Bill[] = [];

// ---- seed rooms: blocks A & B, floors 5-6, 8 rooms per floor ----
for (const block of ["A", "B"]) {
    for (const floor of [5, 6]) {
        for (let i = 1; i <= 8; i++) {
            const roomNo = `${floor}${String(i + 20).padStart(2, "0")}`; // 521..528, 621..628
            rooms.push({
                id: `room-${block}-${roomNo}`,
                roomNo,
                block,
                floor,
                capacity: i % 3 === 0 ? 3 : 2,
            });
        }
    }
}

// ---- seed students (~70% occupancy, room 621-A/B kept for the known pair) ----
let studentSeq = 1;
function addStudent(room: Room, slot: string, username?: string, fatherName?: string, mobileNo?: string) {
    students.push({
        id: `stu-${String(studentSeq++).padStart(3, "0")}`,
        username: username ?? `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        fatherName: fatherName ?? `${pick(FATHER_PREFIX)} ${pick(LAST_NAMES)}`,
        mobileNo: mobileNo ?? `9${randInt(100000000, 999999999)}`,
        roomNo: room.roomNo,
        slot,
        block: room.block,
        floor: room.floor,
    });
}

for (const room of rooms) {
    if (room.block === "A" && room.roomNo === "621") {
        addStudent(room, "A", "Avinoor Singh", "Rajinder Singh", "6239512160");
        addStudent(room, "B", "Keshav Babbar", "Sukhdev Babbar", "7814922310");
        continue;
    }
    const occupied = randInt(0, room.capacity);
    for (let s = 0; s < occupied; s++) {
        addStudent(room, SLOT_LABELS[s]);
    }
}

// ---- seed bills: every student x every month ----
// Jan–Apr are generated and fully paid; May is generated with a mix of paid /
// partial / unpaid (so June's generation has dues to carry); June is current
// and not generated yet.
const LAST_GENERATED_MONTH = "2026-05";
let billSeq = 1;
for (const student of students) {
    for (const month of MONTHS) {
        const isCurrent = month === CURRENT_MONTH;
        const generated = !isCurrent;
        const dietCount = randInt(8, 30);
        const specialDietCount = randInt(0, 6);
        const canteenBill = randInt(300, 2600);

        let bill: Bill = {
            id: `bill-${String(billSeq++).padStart(4, "0")}`,
            studentId: student.id,
            studentName: student.username,
            roomNo: student.roomNo,
            slot: student.slot,
            month,
            canteenBill,
            dietCount,
            specialDietCount,
            generated,
            previousDue: 0,
            lateFine: 0,
            paidAmount: 0,
            status: "UNPAID",
        };

        if (generated) {
            // past months were generated with last semester's prices
            const dietAmount = Math.max(dietCount, 20) * 120;
            const specialDietAmount = Math.max(specialDietCount, 2) * 60;
            const subtotal = canteenBill + dietAmount + specialDietAmount;
            const fine = subtotal > 5000 ? Math.round(subtotal * 0.05) : 0;
            const totalAmount = subtotal + fine;

            const roll = rand();
            const isLastGenerated = month === LAST_GENERATED_MONTH;
            // only May keeps open dues; older months are settled
            const paidAmount = !isLastGenerated || roll < 0.7
                ? totalAmount
                : roll < 0.85
                    ? Math.round(totalAmount * 0.6) // partial payer
                    : 0; // hasn't paid at all

            bill = {
                ...bill,
                dietAmount,
                specialDietAmount,
                fine,
                totalAmount,
                dueDate: defaultDueDate(month),
                lateFinePerDay: 10,
                paidAmount,
                lastPaymentDate: paidAmount > 0 ? defaultDueDate(month) : undefined,
                status:
                    paidAmount >= totalAmount
                        ? "PAID"
                        : paidAmount > 0
                            ? "PARTIAL"
                            : "UNPAID",
            };
        }
        bills.push(bill);
    }
}

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export function occupantsOf(roomId: string): Student[] {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return [];
    return students.filter((s) => s.roomNo === room.roomNo && s.block === room.block);
}

export function nextFreeSlot(room: Room): string | null {
    const taken = occupantsOf(room.id).map((s) => s.slot);
    return SLOT_LABELS.slice(0, room.capacity).find((s) => !taken.includes(s)) ?? null;
}

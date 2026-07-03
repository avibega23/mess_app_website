import { Paginated } from "@/types/common/api.types";
import {
    RegisterStudentPayload,
    Student,
    StudentFilters,
    UpdateStudentPayload,
} from "@/types/students/student.types";
import { Bill } from "@/types/bills/bill.types";
import { bills, delay, nextFreeSlot, rooms, students } from "@/lib/mock/db";
import { CURRENT_MONTH } from "@/lib/mock/db";

// Real backend swap: replace each function body with the commented apiClient call.
// import apiClient from "@/lib/apiClient/client";

export const getStudents = async (
    filters: StudentFilters = {}
): Promise<Paginated<Student>> => {
    // const { data } = await apiClient.get("/students", { params: filters });
    // return data;
    await delay();
    const { block, floor, search, page = 1, pageSize = 10 } = filters;

    let result = [...students];
    if (block) result = result.filter((s) => s.block === block);
    if (floor !== undefined) result = result.filter((s) => s.floor === floor);
    if (search) {
        const q = search.toLowerCase();
        result = result.filter(
            (s) =>
                s.username.toLowerCase().includes(q) ||
                s.mobileNo.includes(q) ||
                s.roomNo.includes(q)
        );
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    return {
        data: result.slice(start, start + pageSize),
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
};

export const getStudentById = async (id: string): Promise<Student> => {
    // const { data } = await apiClient.get(`/students/${id}`);
    // return data;
    await delay();
    const student = students.find((s) => s.id === id);
    if (!student) throw new Error("Student not found");
    return { ...student };
};

export const getStudentBills = async (studentId: string): Promise<Bill[]> => {
    // const { data } = await apiClient.get(`/students/${studentId}/bills`);
    // return data;
    await delay();
    return bills
        .filter((b) => b.studentId === studentId)
        .sort((a, b) => a.month.localeCompare(b.month));
};

export const registerStudent = async (
    payload: RegisterStudentPayload
): Promise<Student> => {
    // const { data } = await apiClient.post("/students", payload);
    // return data;
    await delay();
    const room = rooms.find((r) => r.id === payload.roomId);
    if (!room) throw new Error("Room not found");
    const slot = nextFreeSlot(room);
    if (!slot) throw new Error(`Room ${room.roomNo} (${room.block}) is full`);

    const student: Student = {
        id: `stu-${Date.now()}`,
        username: payload.username,
        fatherName: payload.fatherName,
        mobileNo: payload.mobileNo,
        roomNo: room.roomNo,
        slot,
        block: room.block,
        floor: room.floor,
    };
    students.push(student);
    bills.push({
        id: `bill-${Date.now()}`,
        studentId: student.id,
        studentName: student.username,
        roomNo: student.roomNo,
        slot: student.slot,
        month: CURRENT_MONTH,
        canteenBill: 0,
        dietCount: 0,
        specialDietCount: 0,
        generated: false,
        previousDue: 0,
        lateFine: 0,
        paidAmount: 0,
        status: "UNPAID",
    });
    return { ...student };
};

export const updateStudent = async (
    id: string,
    payload: UpdateStudentPayload
): Promise<Student> => {
    // const { data } = await apiClient.patch(`/students/${id}`, payload);
    // return data;
    await delay();
    const student = students.find((s) => s.id === id);
    if (!student) throw new Error("Student not found");

    const room = rooms.find((r) => r.id === payload.roomId);
    if (!room) throw new Error("Room not found");

    const movingRooms = room.roomNo !== student.roomNo || room.block !== student.block;
    if (movingRooms) {
        const slot = nextFreeSlot(room);
        if (!slot) throw new Error(`Room ${room.roomNo} (${room.block}) is full`);
        student.roomNo = room.roomNo;
        student.block = room.block;
        student.floor = room.floor;
        student.slot = slot;
    }
    student.username = payload.username;
    student.fatherName = payload.fatherName;
    student.mobileNo = payload.mobileNo;

    for (const bill of bills) {
        if (bill.studentId === id) {
            bill.studentName = student.username;
            bill.roomNo = student.roomNo;
            bill.slot = student.slot;
        }
    }
    return { ...student };
};

export const deleteStudent = async (id: string): Promise<void> => {
    // await apiClient.delete(`/students/${id}`);
    await delay();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    students.splice(index, 1);
};

/** Semester reset: removes every registered student. */
export const clearAllStudents = async (): Promise<void> => {
    // await apiClient.delete("/students");
    await delay(700);
    students.length = 0;
};

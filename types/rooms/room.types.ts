import { Student } from "@/types/students/student.types";

export interface Room {
    id: string;
    roomNo: string;
    block: string;
    floor: number;
    capacity: 2 | 3;
}

export interface RoomWithOccupancy extends Room {
    occupantCount: number;
}

export interface RoomDetail extends Room {
    occupants: Student[];
}

export interface RoomFilters {
    block?: string;
    floor?: number;
    onlyVacant?: boolean;
}

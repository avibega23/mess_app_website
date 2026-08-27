import { StudentResponse as Student, StudentResponse } from "@/types/students/student.types";

export interface Room {
  _id: string;
  hostelId: string;
  messId: {
    _id: string;
    messBlock: string;
  };
  floorId: {
    _id: string;
    floorNo: number
  };
  capacity: 2 | 3;
  slot: [
    {
      label: string,
      userId: string,
      occupied: boolean,
      _id: string
    }
  ];
  roomNo: string;
}

export interface RoomWithOccupancy extends Room {
  occupiedCount: number;
}

export interface RoomDetail extends Room {
  occupiedCount: number;
  occupants: StudentResponse[]

}

export interface RoomFilters {
  messId?: string;
  floor?: number;
  vacant?: string;
  pageNo?: number;
  pageLimit?: number;
}


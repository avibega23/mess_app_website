import { StudentResponse as Student } from "@/types/students/student.types";

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
  occupantCount: number;
}

export interface RoomDetail extends Room {
  occupantCount: number;
}

export interface RoomFilters {
  messId?: string;
  floor?: number;
  vacant?: string;
  pageNo?: number;
  pageLimit?: number;
}


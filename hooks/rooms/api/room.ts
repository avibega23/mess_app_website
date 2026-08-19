import apiClient from "@/lib/apiClient/client";
import { ApiResponse } from "@/types/common/api.types";
import { RoomDetail, RoomFilters, RoomWithOccupancy } from "@/types/rooms/room.types";

// /clerk/rooms is paginated on the backend: ApiResponse.data is
// { currentPage, limit, total, totalPages, data: RoomWithOccupancy[] }, not a bare array.
interface PaginatedRoomsResponse {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  data: RoomWithOccupancy[];
}

export const getRooms = async (
  filters: RoomFilters = {}
): Promise<RoomWithOccupancy[]> => {
  const { data } = await apiClient.get<ApiResponse<PaginatedRoomsResponse>>("/clerk/rooms", { params: filters });
  return data.data.data;
};

export const getRoomById = async (id: string): Promise<RoomDetail> => {
  const { data } = await apiClient.get<ApiResponse<RoomDetail>>(`/clerk/rooms/${id}`);
  return data.data;
};

import apiClient from "@/lib/apiClient/client";
import { ApiResponse } from "@/types/common/api.types";
import { RoomDetail, RoomFilters, RoomWithOccupancy } from "@/types/rooms/room.types";


export const getRooms = async (
  filters: RoomFilters = {}
): Promise<RoomWithOccupancy[]> => {
  const { data } = await apiClient.get<ApiResponse<RoomWithOccupancy[]>>("/clerk/rooms", { params: filters });
  return data.data;
};

export const getRoomById = async (id: string): Promise<RoomDetail> => {
  const { data } = await apiClient.get<ApiResponse<RoomDetail>>(`/clerk/rooms/${id}`);
  return data.data;
};
